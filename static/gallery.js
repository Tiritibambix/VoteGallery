let photos = [];
let userVotes = 0;
let modal = document.getElementById('modal');
let modalImg = document.getElementById('modal-img');
let closeBtn = document.querySelector('.close');
let completionModal = document.getElementById('completion-modal');

// Charger les photos
fetch('/api/photos')
    .then(r => r.json())
    .then(data => {
        photos = data;
        // Mélanger aléatoirement
        photos.sort(() => Math.random() - 0.5);
        renderGallery();
        updateVoteCount();
    });

// Charger les votes de l'utilisateur
function updateVoteCount() {
    fetch('/api/user_votes')
        .then(r => r.json())
        .then(data => {
            userVotes = data.votes;
            document.getElementById('vote-count').textContent = userVotes;
            
            if (userVotes >= 20) {
                showCompletionModal();
            }
            
            updateButtonStates();
        });
}

// Afficher le modal de completion
function showCompletionModal() {
    completionModal.style.display = 'flex';
    document.body.style.overflow = 'hidden';
    document.querySelectorAll('.vote-btn').forEach(btn => btn.disabled = true);
}

// Afficher la galerie
function renderGallery() {
    const gallery = document.getElementById('gallery');
    gallery.innerHTML = '';
    
    photos.forEach(photo => {
        const card = document.createElement('div');
        card.className = 'photo-card';
        card.innerHTML = `
            <img class="photo-img" src="/photos/${photo}" alt="Photo">
            <div class="photo-footer">
                <button class="vote-btn" data-photo="${photo}">Vote</button>
            </div>
        `;
        
        // Désactiver le clic-droit sur l'image
        card.querySelector('.photo-img').addEventListener('contextmenu', (e) => e.preventDefault());
        
        // Zoom sur click photo
        card.querySelector('.photo-img').addEventListener('click', () => openModal(photo));
        
        // Vote
        card.querySelector('.vote-btn').addEventListener('click', (e) => {
            e.stopPropagation();
            vote(photo, card.querySelector('.vote-btn'));
        });
        
        gallery.appendChild(card);
    });
}

// Mettre à jour les états des boutons
function updateButtonStates() {
    fetch('/api/user_votes')
        .then(r => r.json())
        .then(data => {
            const votedPhotos = data.voted_photos || [];
            document.querySelectorAll('.vote-btn').forEach(btn => {
                const photo = btn.dataset.photo;
                if (votedPhotos.includes(photo)) {
                    btn.textContent = '✓ Voté';
                    btn.disabled = true;
                    btn.classList.add('voted');
                }
            });
        });
}

// Enregistrer un vote
function vote(photo, btn) {
    if (userVotes >= 20) return;
    
    fetch('/api/vote', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({photo})
    })
    .then(r => {
        if (!r.ok) {
            return r.json().then(data => {
                throw new Error(data.error || 'Erreur serveur');
            });
        }
        return r.json();
    })
    .then(data => {
        if (data.success) {
            btn.textContent = '✓ Voté';
            btn.disabled = true;
            btn.classList.add('voted');
            updateVoteCount();
        }
    })
    .catch(e => {
        console.error('Erreur:', e);
        alert('Erreur : ' + e.message);
    });
}

// Modal zoom
function openModal(photo) {
    modal.style.display = 'flex';
    modalImg.src = `/photos/${photo}`;
    // Désactiver le clic-droit sur l'image en grand
    modalImg.addEventListener('contextmenu', (e) => e.preventDefault());
}

closeBtn.addEventListener('click', () => {
    modal.style.display = 'none';
});

modal.addEventListener('click', (e) => {
    if (e.target === modal) modal.style.display = 'none';
});
