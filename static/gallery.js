let photos = [];
let userVotes = 0;
let modal = document.getElementById('modal');
let modalImg = document.getElementById('modal-img');
let closeBtn = document.querySelector('.close');

// Charger les photos
fetch('/api/photos')
    .then(r => r.json())
    .then(data => {
        photos = data;
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
                document.getElementById('completion-message').style.display = 'block';
                document.querySelectorAll('.vote-btn').forEach(btn => btn.disabled = true);
            }
        });
}

// Afficher la galerie
function renderGallery() {
    const gallery = document.getElementById('gallery');
    gallery.innerHTML = '';
    
    photos.forEach(photo => {
        const card = document.createElement('div');
        card.className = 'photo-card';
        card.innerHTML = `
            <img class="photo-img" src="/photos/${photo}" alt="${photo}">
            <div class="photo-footer">
                <button class="vote-btn" data-photo="${photo}">Vote</button>
            </div>
        `;
        
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

// Enregistrer un vote
function vote(photo, btn) {
    if (userVotes >= 20) return;
    
    fetch('/api/vote', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({photo})
    })
    .then(r => r.json())
    .then(data => {
        if (data.success) {
            btn.textContent = '✓ Voté';
            btn.disabled = true;
            btn.classList.add('voted');
            updateVoteCount();
        }
    })
    .catch(e => alert('Erreur : ' + e));
}

// Modal zoom
function openModal(photo) {
    modal.style.display = 'flex';
    modalImg.src = `/photos/${photo}`;
}

closeBtn.addEventListener('click', () => {
    modal.style.display = 'none';
});

modal.addEventListener('click', (e) => {
    if (e.target === modal) modal.style.display = 'none';
});
