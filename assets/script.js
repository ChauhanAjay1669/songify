   // Main application controller
   class Songify {
    constructor() {
        this.audio = new Audio();
        this.songs = [];
        this.currentSongIndex = 0;
        this.isPlaying = false;
        this.isShuffleOn = false;
        this.isRepeatOn = false;
        this.volume = 0.8;
        this.queue = [];
        this.playlists = [];
        this.currentPlaylist = null;
        this.lyrics = {};
        
        this.initElements();
        this.initEventListeners();
        this.loadInitialData();
    }

    initElements() {
        // Player controls
        this.playButton = document.getElementById('play-button');
        this.playIcon = document.getElementById('play-icon');
        this.prevButton = document.getElementById('prev');
        this.nextButton = document.getElementById('next');
        this.progressBar = document.getElementById('progress-bar');
        this.currentTimeEl = document.getElementById('current-time');
        this.durationEl = document.getElementById('duration');
        this.volumeControl = document.getElementById('volume');
        this.volumeIcon = document.getElementById('volume-icon');
        this.shuffleButton = document.getElementById('shuffle');
        this.repeatButton = document.getElementById('repeat');
        
        // Expanded player
        this.expPlayer = document.getElementById('expanded-player');
        this.expPlayButton = document.getElementById('exp-play-button');
        this.expPlayIcon = document.getElementById('exp-play-icon');
        this.expProgressBar = document.getElementById('exp-progress-bar');
        this.expCurrentTimeEl = document.getElementById('exp-current-time');
        this.expDurationEl = document.getElementById('exp-duration');
        this.togglePlayer = document.getElementById('toggle-player');
        this.mobileTogglePlayer = document.getElementById('mobile-toggle-player');
        
        // Full screen player
        this.fullScreenButton = document.getElementById('full-screen-button');
        this.fullScreenPlayer = document.getElementById('full-screen-player');
        this.exitFullScreen = document.getElementById('exit-full-screen');
        this.fsPlayButton = document.getElementById('fs-play-button');
        this.fsPlayIcon = document.getElementById('fs-play-icon');
        this.fsProgressBar = document.getElementById('full-screen-progress');
        this.fsCurrentTimeEl = document.getElementById('full-screen-current-time');
        this.fsDurationEl = document.getElementById('full-screen-duration');
        
        // UI elements
        this.cardsContainer = document.getElementById('cards-container');
        this.playlistContainer = document.getElementById('playlist-container');
        this.songTable = document.getElementById('songTable');
        this.searchBox = document.getElementById('search-box');
        this.suggestions = document.getElementById('suggestions');
        this.upNextContainer = document.getElementById('up-next-container');
        
        // Navigation
        this.playlistScreen = document.getElementById('playlist-screen');
        this.playlistShow = document.getElementById('playlistShow');
        this.playlistHide = document.getElementById('playlistHide');
        this.musicPlayer = document.getElementById('music-player');
    }

    initEventListeners() {
        // Player controls
        this.playButton.addEventListener('click', () => this.togglePlay());
        this.expPlayButton.addEventListener('click', () => this.togglePlay());
        this.fsPlayButton.addEventListener('click', () => this.togglePlay());
        this.prevButton.addEventListener('click', () => this.playPrevious());
        this.nextButton.addEventListener('click', () => this.playNext());
        this.audio.addEventListener('timeupdate', () => this.updateProgress());
        this.audio.addEventListener('ended', () => this.handleSongEnd());
        this.audio.addEventListener('loadedmetadata', () => this.updateDuration());
        this.progressBar.parentElement.addEventListener('click', (e) => this.seek(e));
        this.expProgressBar.parentElement.addEventListener('click', (e) => this.seek(e));
        this.fsProgressBar.parentElement.addEventListener('click', (e) => this.seek(e));
        this.volumeControl.addEventListener('input', () => this.setVolume());
        this.shuffleButton.addEventListener('click', () => this.toggleShuffle());
        this.repeatButton.addEventListener('click', () => this.toggleRepeat());
        
        // Expanded player controls
        this.togglePlayer.addEventListener('click', () => this.togglePlayerVisibility());
        this.mobileTogglePlayer.addEventListener('click', () => this.togglePlayerVisibility());
        
        // Full screen controls
        this.fullScreenButton.addEventListener('click', () => this.openFullScreen());
        this.exitFullScreen.addEventListener('click', () => this.closeFullScreen());
        
        // Navigation
        this.playlistShow.addEventListener('click', () => this.showPlaylistScreen());
        this.playlistHide.addEventListener('click', () => this.hidePlaylistScreen());
        
        // Search functionality
        this.searchBox.addEventListener('input', () => this.handleSearch());
        this.searchBox.addEventListener('focus', () => this.suggestions.classList.remove('hidden'));
        document.addEventListener('click', (e) => {
            if (!this.searchBox.contains(e.target) && !this.suggestions.contains(e.target)) {
                this.suggestions.classList.add('hidden');
            }
        });
        
        // Keyboard shortcuts
        document.addEventListener('keydown', (e) => {
            if (e.code === 'Space') {
                e.preventDefault();
                this.togglePlay();
            } else if (e.code === 'ArrowRight') {
                this.playNext();
            } else if (e.code === 'ArrowLeft') {
                this.playPrevious();
            } else if (e.code === 'ArrowUp') {
                this.volumeControl.value = Math.min(parseInt(this.volumeControl.value) + 10, 100);
                this.setVolume();
            } else if (e.code === 'ArrowDown') {
                this.volumeControl.value = Math.max(parseInt(this.volumeControl.value) - 10, 0);
                this.setVolume();
            } else if (e.code === 'KeyF') {
                if (this.fullScreenPlayer.classList.contains('hidden')) {
                    this.openFullScreen();
                } else {
                    this.closeFullScreen();
                }
            }
        });
    }

    // Player controls
    togglePlay() {
        if (this.isPlaying) {
            this.audio.pause();
        } else {
            this.audio.play();
        }
        this.isPlaying = !this.isPlaying;
        this.updatePlayButton();
    }

    updatePlayButton() {
        this.playIcon.className = this.isPlaying ? 'fas fa-pause' : 'fas fa-play';
        this.expPlayIcon.className = this.isPlaying ? 'fas fa-pause' : 'fas fa-play';
        this.fsPlayIcon.className = this.isPlaying ? 'fas fa-pause' : 'fas fa-play';
        
        // Update disc rotation
        const discImages = document.querySelectorAll('.rotate-disc');
        discImages.forEach(img => {
            if (this.isPlaying) {
                img.style.animationPlayState = 'running';
            } else {
                img.style.animationPlayState = 'paused';
            }
        });
    }

    updateProgress() {
        const { currentTime, duration } = this.audio;
        const progressPercent = (currentTime / duration) * 100;
        this.progressBar.style.width = `${progressPercent}%`;
        this.expProgressBar.style.width = `${progressPercent}%`;
        this.fsProgressBar.style.width = `${progressPercent}%`;
        this.currentTimeEl.textContent = this.formatTime(currentTime);
        this.expCurrentTimeEl.textContent = this.formatTime(currentTime);
        this.fsCurrentTimeEl.textContent = this.formatTime(currentTime);
        
        // Update waveform animation
        this.updateWaveform(currentTime, duration);
    }

    updateWaveform(currentTime, duration) {
        const bars = document.querySelectorAll('.waveform-bar');
        if (!bars.length) return;
        
        const progress = currentTime / duration;
        const activeBars = Math.floor(progress * bars.length);
        
        bars.forEach((bar, index) => {
            if (index <= activeBars) {
                bar.style.animationPlayState = this.isPlaying ? 'running' : 'paused';
            } else {
                bar.style.animationPlayState = 'paused';
                bar.style.height = '3px';
            }
        });
    }

    updateDuration() {
        const duration = this.audio.duration || 0;
        this.durationEl.textContent = this.formatTime(duration);
        this.expDurationEl.textContent = this.formatTime(duration);
        this.fsDurationEl.textContent = this.formatTime(duration);
    }

    formatTime(seconds) {
        const minutes = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${minutes}:${secs < 10 ? '0' : ''}${secs}`;
    }

    seek(e) {
        const width = e.currentTarget.clientWidth;
        const clickX = e.offsetX;
        const duration = this.audio.duration;
        this.audio.currentTime = (clickX / width) * duration;
    }

    setVolume() {
        this.volume = this.volumeControl.value / 100;
        this.audio.volume = this.volume;
        
        if (this.volume === 0) {
            this.volumeIcon.className = 'fas fa-volume-mute';
            this.fsVolumeIcon.className = 'fas fa-volume-mute';
        } else if (this.volume < 0.5) {
            this.volumeIcon.className = 'fas fa-volume-down';
            this.fsVolumeIcon.className = 'fas fa-volume-down';
        } else {
            this.volumeIcon.className = 'fas fa-volume-up';
            this.fsVolumeIcon.className = 'fas fa-volume-up';
        }
    }

    toggleShuffle() {
        this.isShuffleOn = !this.isShuffleOn;
        const buttons = [this.shuffleButton, document.getElementById('exp-shuffle'), document.getElementById('fs-shuffle')];
        buttons.forEach(btn => {
            btn.style.color = this.isShuffleOn ? '#7b4dff' : '#b3b3b3';
        });
    }

    toggleRepeat() {
        this.isRepeatOn = !this.isRepeatOn;
        const buttons = [this.repeatButton, document.getElementById('exp-repeat'), document.getElementById('fs-repeat')];
        buttons.forEach(btn => {
            btn.style.color = this.isRepeatOn ? '#7b4dff' : '#b3b3b3';
        });
    }

    handleSongEnd() {
        if (this.isRepeatOn) {
            this.audio.currentTime = 0;
            this.audio.play();
        } else {
            this.playNext();
        }
    }

    // Song management
    playSong(index) {
        if (index < 0 || index >= this.songs.length) return;
        
        this.currentSongIndex = index;
        const song = this.songs[index];
        
        this.audio.src = song.downloadUrl[4].url;
        this.audio.play()
            .then(() => {
                this.isPlaying = true;
                this.updatePlayButton();
                this.updateSongInfo(song);
                this.getRelatedSongs(song.id);
                this.fetchLyrics(song.name, song.artists.primary[0].name);
            })
            .catch(error => {
                console.error('Playback failed:', error);
            });
    }

    updateSongInfo(song) {
        // Mini player
        document.getElementById('img-m').src = song.image[2].url;
        document.getElementById('audio_title').textContent = this.cleanTitle(song.name);
        document.getElementById('artist_name').textContent = song.artists.primary[0].name;
        
        // Expanded player
        document.getElementById('exp-audio_title').textContent = this.cleanTitle(song.name);
        document.getElementById('exp-artist_name').textContent = song.artists.primary[0].name;
        
        // Full screen player
        document.getElementById('full-screen-img').src = song.image[2].url;
        document.getElementById('full-song-name').textContent = this.cleanTitle(song.name);
        document.getElementById('full-song-artist').textContent = song.artists.primary[0].name;
        document.title = `${this.cleanTitle(song.name)} - ${song.artists.primary[0].name}`;
        
        this.updateArtists(song);
    }

    playNext() {
        if (this.isShuffleOn) {
            const randomIndex = Math.floor(Math.random() * this.songs.length);
            this.playSong(randomIndex);
        } else {
            const nextIndex = (this.currentSongIndex + 1) % this.songs.length;
            this.playSong(nextIndex);
        }
    }

    playPrevious() {
        if (this.audio.currentTime > 3) {
            this.audio.currentTime = 0;
        } else {
            const prevIndex = (this.currentSongIndex - 1 + this.songs.length) % this.songs.length;
            this.playSong(prevIndex);
        }
    }

    cleanTitle(title) {
        let cleanedTitle = title.replace(/&quot;/g, '"');
        cleanedTitle = cleanedTitle.replace(/\s*\(.*?\)\s*/g, '').trim();
        return cleanedTitle;
    }

    // UI controls
    togglePlayerVisibility() {
        this.expPlayer.classList.toggle('hidden');
    }

    openFullScreen() {
        this.fullScreenPlayer.classList.remove('hidden');
        document.body.style.overflow = 'hidden';
        this.updateUpNext();
    }

    closeFullScreen() {
        this.fullScreenPlayer.classList.add('hidden');
        document.body.style.overflow = '';
    }

    showPlaylistScreen() {
        this.playlistScreen.classList.remove('hidden');
        this.playlistScreen.style.animation = 'fadeIn 0.3s ease-out';
    }

    hidePlaylistScreen() {
        this.playlistScreen.style.animation = 'fadeOut 0.3s ease-out';
        setTimeout(() => {
            this.playlistScreen.classList.add('hidden');
        }, 300);
    }

    // Data loading
    async loadInitialData() {
        await this.getSongData();
        await this.getPlayLists();
        this.audio.volume = this.volume;
        this.volumeControl.value = this.volume * 100;
    }

    async getSongData() {
        try {
            // Show skeleton loading
            this.showSkeletonLoading();
            
            const response = await fetch('https://saavn.dev/api/playlists?link=https://www.jiosaavn.com/featured/trending-today/I3kvhipIy73uCJW60TJk1Q__&limit=50');
            const data = await response.json();
            this.songs = data.data.songs;
            this.renderSongCards();
        } catch (error) {
            console.error('Error fetching songs:', error);
        }
    }

    showSkeletonLoading() {
        // Skeleton loading is already in the HTML
        // We'll remove it when data loads
    }

    renderSongCards() {
        this.cardsContainer.innerHTML = '';
        
        this.songs.slice(0, 10).forEach((song, index) => {
            const card = document.createElement('div');
            card.className = 'card h-[390px] w-[275px] flex-shrink-0 rounded-xl overflow-hidden hover-scale transition-all cursor-pointer';
            card.innerHTML = `
                <div class="relative h-full group">
                    <img src="${song.image[2].url}" alt="${song.name}" class="w-full h-full object-cover">
                    <div class="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-all flex items-center justify-center">
                        <button class="play-button h-12 w-12 bg-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0 transition-all" data-id="${index}">
                            <i class="fas fa-play text-black"></i>
                        </button>
                    </div>
                    <div class="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/90 to-transparent">
                        <h3 class="font-bold text-lg truncate">${this.cleanTitle(song.name)}</h3>
                        <p class="text-sm text-[#b3b3b3] truncate">${song.artists.primary[0].name}</p>
                    </div>
                </div>
            `;
            this.cardsContainer.appendChild(card);
            
            // Add click event to play button
            card.querySelector('.play-button').addEventListener('click', (e) => {
                e.stopPropagation();
                this.playSong(parseInt(e.currentTarget.getAttribute('data-id')));
            });
            
            // Add click event to card
            card.addEventListener('click', () => {
                this.showSongDetails(song);
            });
        });
    }

    async getPlayLists() {
        try {
            const playlistNames = ['badshah', 'arijit', 'bollywood', 'punjabi', 'english', 'lofi'];
            const playlistPromises = playlistNames.map(name => 
                fetch(`https://saavn.dev/api/search/playlists?query=${name}`)
                    .then(res => res.json())
                    .then(data => data.data.results[0])
            );
            
            this.playlists = await Promise.all(playlistPromises);
            this.renderPlaylistCards();
        } catch (error) {
            console.error('Error fetching playlists:', error);
        }
    }

    renderPlaylistCards() {
        this.playlistContainer.innerHTML = '';
        
        this.playlists.forEach((playlist, index) => {
            const card = document.createElement('div');
            card.className = 'playlist-card rounded-xl overflow-hidden hover-scale transition-all cursor-pointer group';
            card.innerHTML = `
                <div class="relative">
                    <img src="${playlist.image[1].url}" alt="${playlist.name}" class="w-full h-40 object-cover rounded-t-xl">
                    <div class="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-all flex items-center justify-center">
                        <button class="h-10 w-10 bg-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0 transition-all">
                            <i class="fas fa-play text-black"></i>
                        </button>
                    </div>
                </div>
                <div class="p-3 bg-[#1e1e24] rounded-b-xl">
                    <h3 class="font-medium truncate">${playlist.name}</h3>
                    <p class="text-sm text-[#b3b3b3] truncate">${playlist.type} • ${playlist.language}</p>
                </div>
            `;
            this.playlistContainer.appendChild(card);
            
            card.addEventListener('click', () => {
                this.showPlaylistDetails(playlist);
            });
        });
    }

    async showPlaylistDetails(playlist) {
        try {
            const response = await fetch(`https://saavn.dev/api/playlists?link=https://www.jiosaavn.com/featured/${playlist.url}&limit=50`);
            const data = await response.json();
            this.currentPlaylist = data.data;
            this.renderPlaylistDetails();
            this.showPlaylistScreen();
        } catch (error) {
            console.error('Error fetching playlist details:', error);
        }
    }

    renderPlaylistDetails() {
        if (!this.currentPlaylist) return;
        
        document.getElementById('table-play-img').src = this.currentPlaylist.image[1].url;
        document.getElementById('table-play-title').textContent = this.currentPlaylist.name;
        document.getElementById('table-play-count').textContent = `${this.currentPlaylist.followerCount} Followers • ${this.currentPlaylist.songCount} Songs`;
        
        this.songTable.innerHTML = '';
        
        this.currentPlaylist.songs.slice(0, 20).forEach((song, index) => {
            const row = document.createElement('tr');
            row.className = 'hover:bg-[#2a2a32] transition-all cursor-pointer';
            row.innerHTML = `
                <td class="p-4">${index + 1}</td>
                <td class="p-4 flex items-center gap-3">
                    <img src="${song.image[1].url}" alt="${song.name}" class="h-10 w-10 rounded">
                    <div>
                        <h4 class="font-medium">${this.cleanTitle(song.name)}</h4>
                        <p class="text-sm text-[#b3b3b3]">${song.artists.primary[0].name}</p>
                    </div>
                </td>
                <td class="p-4 hidden md:table-cell">${song.artists.primary.map(a => a.name).join(', ')}</td>
                <td class="p-4 hidden md:table-cell">${this.cleanTitle(song.album.name)}</td>
                <td class="p-4 text-right">${this.formatTime(song.duration)}</td>
            `;
            this.songTable.appendChild(row);
            
            row.addEventListener('click', () => {
                this.playSongFromPlaylist(index);
            });
        });
    }

    playSongFromPlaylist(index) {
        if (!this.currentPlaylist) return;
        
        // Set the current playlist songs as the active queue
        this.songs = this.currentPlaylist.songs;
        this.playSong(index);
    }

    async getRelatedSongs(songId) {
        try {
            const response = await fetch(`https://saavn.dev/api/songs/${songId}/suggestions`);
            const data = await response.json();
            this.renderRelatedSongs(data.data);
        } catch (error) {
            console.error('Error fetching related songs:', error);
        }
    }

    renderRelatedSongs(relatedSongs) {
        this.upNextContainer.innerHTML = '';
        
        relatedSongs.slice(0, 6).forEach(song => {
            const card = document.createElement('div');
            card.className = 'flex items-center gap-3 p-3 rounded-lg hover:bg-[#2a2a32] transition-all cursor-pointer';
            card.innerHTML = `
                <img src="${song.image[1].url}" alt="${song.name}" class="h-12 w-12 rounded-lg">
                <div class="flex-1">
                    <h4 class="font-medium truncate">${this.cleanTitle(song.name)}</h4>
                    <p class="text-sm text-[#b3b3b3] truncate">${song.artists.primary[0].name}</p>
                </div>
                <span class="text-sm text-[#b3b3b3]">${this.formatTime(song.duration)}</span>
            `;
            this.upNextContainer.appendChild(card);
            
            card.addEventListener('click', () => {
                this.playRelatedSong(song);
            });
        });
    }

    playRelatedSong(song) {
        // Add the song to the queue and play it
        this.songs = [song, ...this.songs];
        this.playSong(0);
    }

    async fetchLyrics(songName, artistName) {
        try {
            // This is a mock implementation - in a real app you'd call a lyrics API
            this.lyrics = {
                lines: [
                    { time: 0, text: "♪ Instrumental ♪" },
                    { time: 10, text: "You're the light, you're the night" },
                    { time: 15, text: "You're the color of my blood" },
                    { time: 20, text: "You're the cure, you're the pain" },
                    { time: 25, text: "You're the only thing I wanna touch" },
                    { time: 30, text: "Never knew that it could mean so much" },
                    { time: 35, text: "♪ Instrumental ♪" }
                ]
            };
            
            this.renderLyrics();
        } catch (error) {
            console.error('Error fetching lyrics:', error);
        }
    }

    renderLyrics() {
        // This would render lyrics in the full screen player
        // Implementation depends on your UI design
    }

    updateArtists(song) {
        const artistContainer = document.getElementById('artist-names');
        if (!artistContainer) return;
        
        artistContainer.innerHTML = '';
        
        song.artists.primary.slice(0, 3).forEach(artist => {
            const artistEl = document.createElement('div');
            artistEl.className = 'flex flex-col items-center';
            artistEl.innerHTML = `
                <img src="${artist.image?.[1]?.url || 'https://via.placeholder.com/150'}" 
                    alt="${artist.name}" 
                    class="h-14 w-14 rounded-full object-cover">
                <span class="text-sm mt-2">${artist.name}</span>
            `;
            artistContainer.appendChild(artistEl);
        });
    }

    updateUpNext() {
        // Update the "Up Next" section in the full screen player
        const upcomingSongs = this.isShuffleOn ? 
            [...this.songs].sort(() => 0.5 - Math.random()).slice(0, 3) :
            this.songs.slice(this.currentSongIndex + 1, this.currentSongIndex + 4);
        
        this.upNextContainer.innerHTML = '';
        
        upcomingSongs.forEach(song => {
            const card = document.createElement('div');
            card.className = 'flex items-center gap-3 p-3 rounded-lg hover:bg-[#2a2a32] transition-all cursor-pointer';
            card.innerHTML = `
                <img src="${song.image[1].url}" alt="${song.name}" class="h-12 w-12 rounded-lg">
                <div class="flex-1">
                    <h4 class="font-medium truncate">${this.cleanTitle(song.name)}</h4>
                    <p class="text-sm text-[#b3b3b3] truncate">${song.artists.primary[0].name}</p>
                </div>
                <span class="text-sm text-[#b3b3b3]">${this.formatTime(song.duration)}</span>
            `;
            this.upNextContainer.appendChild(card);
            
            card.addEventListener('click', () => {
                const songIndex = this.songs.findIndex(s => s.id === song.id);
                if (songIndex !== -1) {
                    this.playSong(songIndex);
                }
            });
        });
    }

    // Search functionality
    async handleSearch() {
        const query = this.searchBox.value.trim();
        if (query.length < 3) {
            this.suggestions.classList.add('hidden');
            return;
        }
        
        try {
            const response = await fetch(`https://saavn.dev/api/search?query=${encodeURIComponent(query)}`);
            const data = await response.json();
            this.displaySearchResults(data.data.songs.results);
        } catch (error) {
            console.error('Error searching:', error);
        }
    }

    displaySearchResults(results) {
        this.suggestions.innerHTML = '';
        
        if (!results || results.length === 0) {
            this.suggestions.classList.add('hidden');
            return;
        }
        
        results.slice(0, 5).forEach(result => {
            const item = document.createElement('li');
            item.className = 'p-3 hover:bg-[#2a2a32] transition-all cursor-pointer flex items-center gap-3';
            item.innerHTML = `
                <img src="${result.image[1].url}" alt="${result.title}" class="h-10 w-10 rounded">
                <div>
                    <h4 class="font-medium">${this.cleanTitle(result.title)}</h4>
                    <p class="text-sm text-[#b3b3b3]">${result.primary_artists}</p>
                </div>
            `;
            this.suggestions.appendChild(item);
            
            item.addEventListener('click', () => {
                this.searchBox.value = result.title;
                this.suggestions.classList.add('hidden');
                this.playSearchResult(result.id);
            });
        });
        
        this.suggestions.classList.remove('hidden');
    }

    async playSearchResult(songId) {
        try {
            const response = await fetch(`https://saavn.dev/api/songs/${songId}`);
            const data = await response.json();
            const song = data.data[0];
            
            // Add the song to the queue and play it
            this.songs = [song, ...this.songs];
            this.playSong(0);
        } catch (error) {
            console.error('Error playing search result:', error);
        }
    }

    showSongDetails(song) {
        // You can implement a detailed song view here
        console.log('Showing details for:', song.name);
    }
}

// Initialize the app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    const songify = new Songify();
    
    // Add CSS animations dynamically
    const style = document.createElement('style');
    style.textContent = `
        @keyframes fadeIn {
            from { opacity: 0; transform: translateY(10px); }
            to { opacity: 1; transform: translateY(0); }
        }
        
        @keyframes fadeOut {
            from { opacity: 1; transform: translateY(0); }
            to { opacity: 0; transform: translateY(10px); }
        }
        
        @keyframes pulse {
            0% { transform: scale(1); }
            50% { transform: scale(1.05); }
            100% { transform: scale(1); }
        }
        
        .animate-fade {
            animation: fadeIn 0.5s ease-out forwards;
        }
        
        .player-hidden {
            transform: translateY(100%);
        }
        
        .hover-scale {
            transition: transform 0.3s ease;
        }
        
        .hover-scale:hover {
            transform: scale(1.03);
        }
    `;
    document.head.appendChild(style);
});