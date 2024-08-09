const fileInput = document.getElementById('fileInput');
const playlist = document.getElementById('playlist');
const playPauseButton = document.getElementById('play-pause');
const prevButton = document.getElementById('prev');
const nextButton = document.getElementById('next');
const songInfo = document.getElementById('songInfo');
const seekBar = document.getElementById('seek');

let audio = new Audio();
let currentIndex = -1;
let songs = JSON.parse(localStorage.getItem('songs')) || [];
let isPlaying = false;

document.addEventListener('DOMContentLoaded', () => {
    loadPlaylist();
});

fileInput.addEventListener('change', (event) => {
    const files = event.target.files;
    for (let file of files) {
        const reader = new FileReader();
        reader.onload = (e) => {
            const song = {
                name: file.name,
                data: e.target.result
            };
            songs.push(song);
            localStorage.setItem('songs', JSON.stringify(songs));
            addSongToPlaylist(song);
        };
        reader.readAsDataURL(file);
    }
});

playPauseButton.addEventListener('click', () => {
    if (isPlaying) {
        audio.pause();
        isPlaying = false;
    } else {
        if (audio.src) {
            audio.play();
            isPlaying = true;
        } else {
            playSong();
        }
    }
    updatePlayPauseIcon();
});

prevButton.addEventListener('click', () => {
    if (currentIndex > 0) {
        currentIndex--;
        playSong();
    }
});

nextButton.addEventListener('click', () => {
    if (currentIndex < songs.length - 1) {
        currentIndex++;
        playSong();
    }
});

audio.addEventListener('timeupdate', () => {
    const progress = (audio.currentTime / audio.duration) * 100;
    seekBar.value = progress;
    updateSongInfo();
});

seekBar.addEventListener('input', (event) => {
    const seekTo = (audio.duration / 100) * event.target.value;
    audio.currentTime = seekTo;
});

function loadPlaylist() {
    songs.forEach(song => {
        addSongToPlaylist(song);
    });
}

function addSongToPlaylist(song) {
    const li = document.createElement('li');
    li.textContent = song.name;
    li.addEventListener('click', () => {
        currentIndex = songs.indexOf(song);
        playSong();
    });
    playlist.appendChild(li);
}

function playSong() {
    if (currentIndex >= 0 && currentIndex < songs.length) {
        const song = songs[currentIndex];
        audio.src = song.data;
        audio.play();
        isPlaying = true;
        updatePlayPauseIcon();
        updateSongInfo();
    }
}

function updatePlayPauseIcon() {
    const icon = playPauseButton.querySelector('i');
    icon.className = isPlaying ? 'fas fa-pause' : 'fas fa-play';
}

function updateSongInfo() {
    songInfo.textContent = `Çalan Şarkı: ${songs[currentIndex].name} (${formatTime(audio.currentTime)} / ${audio.duration ? formatTime(audio.duration) : '0:00'})`;
}

function formatTime(seconds) {
    const minutes = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${minutes}:${secs < 10 ? '0' : ''}${secs}`;
}