// Global state
const state = {
  currentSong: null,
  isPlaying: false,
  volume: 0.8,
  currentTime: 0,
  duration: 0,
  queue: [],
  likedSongs: [],
  recentlyPlayed: [],
  trendingSongs: [],
  selectedArtist: null,
  isDarkMode: true,
  showAllArtists: false,
  showAllDurgaBhajans: false,
  audioContext: null,
  analyser: null,
  visualizerActive: false,
  animationFrame: null,
}

// DOM Elements
const audioPlayer = document.getElementById("audio-player")
const miniPlayer = document.getElementById("mini-player")
const fullPlayer = document.getElementById("full-player")
const searchInput = document.getElementById("search-input")
const searchResults = document.getElementById("search-results")
const searchResultsContainer = document.getElementById("search-results-container")
const userDropdownTrigger = document.getElementById("user-dropdown-trigger")
const userDropdown = document.getElementById("user-dropdown")
const toggleSidebar = document.getElementById("toggle-sidebar")
const sidebar = document.getElementById("sidebar")
const toggleTheme = document.getElementById("toggle-theme")
const homePage = document.getElementById("home-page")
const artistPage = document.getElementById("artist-page")
const backToHome = document.getElementById("back-to-home")
const artistName = document.getElementById("artist-name")
const artistSongsContainer = document.getElementById("artist-songs-container")
const trendingContainer = document.getElementById("trending-container")
const trendingPrev = document.getElementById("trending-prev")
const trendingNext = document.getElementById("trending-next")
const recentlyPlayedSection = document.getElementById("recently-played-section")
const recentlyPlayedContainer = document.getElementById("recently-played-container")
const topArtistsContainer = document.getElementById("top-artists-container")
const showMoreArtistsContainer = document.getElementById("show-more-artists-container")
const showMoreArtists = document.getElementById("show-more-artists")
const shivaBhajansContainer = document.getElementById("shiva-bhajans-container")
const durgaBhajansContainer = document.getElementById("durga-bhajans-container")
const showMoreDurgaContainer = document.getElementById("show-more-durga-container")
const showMoreDurga = document.getElementById("show-more-durga")
const playAllShiva = document.getElementById("play-all-shiva")
const playAllDurga = document.getElementById("play-all-durga")

// Player elements
const miniPlayerImage = document.getElementById("mini-player-image")
const miniPlayerTitle = document.getElementById("mini-player-title")
const miniPlayerArtist = document.getElementById("mini-player-artist")
const miniPlayerPlay = document.getElementById("mini-player-play")
const miniPlayerPrev = document.getElementById("mini-player-prev")
const miniPlayerNext = document.getElementById("mini-player-next")
const miniPlayerLike = document.getElementById("mini-player-like")
const miniPlayerExpand = document.getElementById("mini-player-expand")
const currentTimeDisplay = document.getElementById("current-time")
const durationDisplay = document.getElementById("duration")
const progressBar = document.getElementById("progress-bar")

const fullPlayerImage = document.getElementById("full-player-image")
const fullPlayerTitle = document.getElementById("full-player-title")
const fullPlayerArtist = document.getElementById("full-player-artist")
const fullPlayerPlay = document.getElementById("full-player-play")
const fullPlayerPrev = document.getElementById("full-player-prev")
const fullPlayerNext = document.getElementById("full-player-next")
const fullPlayerLike = document.getElementById("full-player-like")
const fullPlayerClose = document.getElementById("full-player-close")
const fullPlayerMinimize = document.getElementById("full-player-minimize")
const fullPlayerCurrentTime = document.getElementById("full-player-current-time")
const fullPlayerDuration = document.getElementById("full-player-duration")
const fullPlayerProgress = document.getElementById("full-player-progress")
const volumeBar = document.getElementById("volume-bar")
const volumeToggle = document.getElementById("volume-toggle")
const toggleVisualizer = document.getElementById("toggle-visualizer")
const visualizerContainer = document.getElementById("visualizer-container")
const visualizer = document.getElementById("visualizer")

// Initialize the application
document.addEventListener("DOMContentLoaded", () => {
  initializeApp()
})

// Initialize the application
function initializeApp() {
  // Set up audio player event listeners
  setupAudioPlayer()

  // Fetch initial data
  fetchTrendingSongs()
  fetchTopArtists()
  fetchShivaBhajans()
  fetchDurgaBhajans()
  initializeDevotionalSections()
  initializeCategorySections()
  initializeEnglishTracksSections()

  // Set up event listeners
  setupEventListeners()
}

// Set up audio player event listeners
function setupAudioPlayer() {
  audioPlayer.volume = state.volume

  audioPlayer.addEventListener("timeupdate", updateProgress)
  audioPlayer.addEventListener("loadedmetadata", () => {
    state.duration = audioPlayer.duration
    updateDurationDisplay()
  })
  audioPlayer.addEventListener("ended", playNextSong)

  // Set up player controls
  miniPlayerPlay.addEventListener("click", togglePlayPause)
  fullPlayerPlay.addEventListener("click", togglePlayPause)
  miniPlayerPrev.addEventListener("click", playPreviousSong)
  fullPlayerPrev.addEventListener("click", playPreviousSong)
  miniPlayerNext.addEventListener("click", playNextSong)
  fullPlayerNext.addEventListener("click", playNextSong)
  miniPlayerLike.addEventListener("click", toggleLike)
  fullPlayerLike.addEventListener("click", toggleLike)
  miniPlayerExpand.addEventListener("click", expandPlayer)
  fullPlayerClose.addEventListener("click", minimizePlayer)
  fullPlayerMinimize.addEventListener("click", minimizePlayer)

  // Set up volume control
  volumeToggle.addEventListener("click", toggleMute)

  // Set up visualizer
  toggleVisualizer.addEventListener("click", toggleAudioVisualizer)
}

// Set up event listeners
function setupEventListeners() {
  // Search functionality
  searchInput.addEventListener("input", debounce(handleSearch, 300))
  document.addEventListener("click", (e) => {
    if (!searchInput.contains(e.target) && !searchResults.contains(e.target)) {
      searchResults.classList.add("hidden")
    }
  })

  // User dropdown
  userDropdownTrigger.addEventListener("click", () => {
    userDropdown.classList.toggle("hidden")
  })
  document.addEventListener("click", (e) => {
    if (!userDropdownTrigger.contains(e.target) && !userDropdown.contains(e.target)) {
      userDropdown.classList.add("hidden")
    }
  })

  // Sidebar toggle
  toggleSidebar.addEventListener("click", () => {
    sidebar.classList.toggle("w-64")
    sidebar.classList.toggle("w-20")

    const sidebarExpanded = sidebar.classList.contains("w-64")
    const sidebarLabels = sidebar.querySelectorAll("button span")
    const sidebarHeaders = sidebar.querySelectorAll("h3")

    sidebarLabels.forEach((label) => {
      label.classList.toggle("hidden", !sidebarExpanded)
    })

    sidebarHeaders.forEach((header) => {
      header.classList.toggle("sr-only", !sidebarExpanded)
    })

    toggleSidebar.innerHTML = sidebarExpanded
      ? `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-5 h-5">
        <line x1="3" y1="6" x2="21" y2="6"></line>
        <line x1="3" y1="12" x2="21" y2="12"></line>
        <line x1="3" y1="18" x2="21" y2="18"></line>
      </svg>
      <span>Collapse</span>`
      : `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-5 h-5 mx-auto">
        <line x1="3" y1="6" x2="21" y2="6"></line>
        <line x1="3" y1="12" x2="21" y2="12"></line>
        <line x1="3" y1="18" x2="21" y2="18"></line>
      </svg>`
  })

  // Theme toggle
  toggleTheme.addEventListener("click", () => {
    document.documentElement.classList.toggle("dark")
    state.isDarkMode = !state.isDarkMode

    toggleTheme.innerHTML = state.isDarkMode
      ? `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-5 h-5">
        <circle cx="12" cy="12" r="4"></circle>
        <path d="M12 2v2"></path>
        <path d="M12 20v2"></path>
        <path d="m4.93 4.93 1.41 1.41"></path>
        <path d="m17.66 17.66 1.41 1.41"></path>
        <path d="M2 12h2"></path>
        <path d="M20 12h2"></path>
        <path d="m6.34 17.66-1.41 1.41"></path>
        <path d="m19.07 4.93-1.41 1.41"></path>
      </svg>
      <span>Light Mode</span>`
      : `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-5 h-5">
        <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"></path>
      </svg>
      <span>Dark Mode</span>`
  })

  // Navigation
  backToHome.addEventListener("click", () => {
    artistPage.classList.add("hidden")
    homePage.classList.remove("hidden")
    state.selectedArtist = null
  })

  // Trending section navigation
  trendingPrev.addEventListener("click", () => {
    trendingContainer.scrollBy({ left: -trendingContainer.clientWidth, behavior: "smooth" })
  })
  trendingNext.addEventListener("click", () => {
    trendingContainer.scrollBy({ left: trendingContainer.clientWidth, behavior: "smooth" })
  })

  // Show more artists
  showMoreArtists.addEventListener("click", () => {
    state.showAllArtists = !state.showAllArtists
    renderTopArtists()
  })

  // Show more Durga bhajans
  showMoreDurga.addEventListener("click", () => {
    state.showAllDurgaBhajans = !state.showAllDurgaBhajans
    renderDurgaBhajans()
  })

  // Play all buttons
  playAllShiva.addEventListener("click", () => playAllSongs("shiva"))
  playAllDurga.addEventListener("click", () => playAllSongs("durga"))
}

// Fetch trending songs
async function fetchTrendingSongs() {
  try {
    const response = await fetch("https://saavn.dev/api/playlists?id=I3kvhipIy73uCJW60TJk1Q__&limit=20")
    const data = await response.json()
    if (data.data && data.data.songs) {
      state.trendingSongs = data.data.songs
      renderTrendingSongs()
    }
  } catch (error) {
    console.error("Error fetching trending songs:", error)
    // Fallback to a different API endpoint if the first one fails
    try {
      const response = await fetch("https://saavn.dev/api/search/songs?query=trending&limit=20")
      const data = await response.json()
      if (data.data && data.data.results) {
        state.trendingSongs = data.data.results
        renderTrendingSongs()
      }
    } catch (fallbackError) {
      console.error("Error fetching trending songs (fallback):", fallbackError)
    }
  }
}

// Fetch top artists
async function fetchTopArtists() {
  try {
    const artistNames = [
      "hansraj raghuwanshi",
      "arijit singh",
      "jubin nautiyal",
      "yo yo honey singh",
      "pawan singh",
      "khesari lal yadav",
      "manoj tiwari",
      "dinesh lal yadav nirahua",
      "shilpi raj",
      "antara singh priyanka",
      "arvind akela kallu",
      "badshah",
      "neha kakkar",
      "ap dhillon",
      "diljit dosanjh",
      "shreya ghoshal",
      "justin bieber",
      "taylor swift",
      "ed sheeran",
      "david bowie",
      "alan walker",
      "mick jagger",
      "adele",
      "dua lipa",
    ]

    const artistPromises = artistNames.map((name) =>
      fetch(`https://saavn.dev/api/search/artists?query=${encodeURIComponent(name)}&limit=1`)
        .then((res) => res.json())
        .then((data) => data.data.results[0])
        .catch(() => null),
    )

    const results = await Promise.all(artistPromises)
    const artists = results.filter(Boolean)

    if (artists.length > 0) {
      renderTopArtists(artists)
      if (artists.length > 12) {
        showMoreArtistsContainer.classList.remove("hidden")
      }
    }
  } catch (error) {
    console.error("Error fetching top artists:", error)
  }
}

// Fetch Shiva bhajans
async function fetchShivaBhajans() {
  try {
    const shivaBhajansList = [
      "Shri Shiv Chalisa",
      "Jai Shiv Omkara",
      "Om Namah Shivay Dhuni",
      "Subah Subah Le Shiv Ka Naam",
      "Shiv Amritvaani",
      "Shiv Tandav Strotam",
      "Hey Bhole Shankar Padharo",
      "Maha Mritunjay Mantra",
      "Jyotirling Ka Dhyan Karo",
      "Bhole Baba Ki Jai Ho",
      "Shiv Dhun",
      "Har Har Mahadev",
    ]

    const songPromises = shivaBhajansList.map((bhajan) =>
      fetch(`https://saavn.dev/api/search/songs?query=${encodeURIComponent(bhajan)}&limit=1`)
        .then((res) => res.json())
        .then((data) => data.data?.results?.[0] || null)
        .catch(() => null),
    )

    const results = await Promise.all(songPromises)
    const songs = results.filter(Boolean)

    if (songs.length > 0) {
      renderShivaBhajans(songs)
    }
  } catch (error) {
    console.error("Error fetching Shiva bhajans:", error)
  }
}

// Fetch Durga bhajans
async function fetchDurgaBhajans() {
  try {
    const durgaBhajansList = [
      "Jai Ambe Gauri Anuradha Paudwal",
      "Ambe Tu Hai Jagdambe Kali Narendra Chanchal",
      "Maiya Yashoda Alka Yagnik",
      "Sherawali Mata Sonu Nigam",
      "Jai Mata Di Lata Mangeshkar",
      "Durga Chalisa Hariharan",
      "Aigiri Nandini",
      "Mera Bhola Hai Bhandari Hansraj Raghuwanshi",
      "Tera Shukar Manata Hoon Narendra Chanchal",
      "Chalo Bulawa Aaya Hai Narendra Chanchal",
      "Maa Sherawali Anuradha Paudwal",
      "Navratri Aayi Falguni Pathak",
      "Main Balak Tu Mata Jagjit Singh",
      "Mata Rani Ki Bhetein Lakhbir Singh Lakkha",
      "Jai Mata Di Hansraj Raghuwanshi",
    ]

    const songPromises = durgaBhajansList.map((bhajan) =>
      fetch(`https://saavn.dev/api/search/songs?query=${encodeURIComponent(bhajan)}&limit=1`)
        .then((res) => res.json())
        .then((data) => data.data?.results?.[0] || null)
        .catch(() => null),
    )

    const results = await Promise.all(songPromises)
    const songs = results.filter(Boolean)

    if (songs.length > 0) {
      state.durgaBhajans = songs
      renderDurgaBhajans()
      if (songs.length > 9) {
        showMoreDurgaContainer.classList.remove("hidden")
      }
    }
  } catch (error) {
    console.error("Error fetching Durga bhajans:", error)
  }
}

// Initialize devotional sections
function initializeDevotionalSections() {
  const devotionalSections = document.querySelectorAll(".devotional-section")

  devotionalSections.forEach((section) => {
    const query = section.dataset.query
    const icon = section.dataset.icon
    const color = section.dataset.color
    const title = section.dataset.title

    fetchDevotionalSongs(section.id, query, icon, color, title)
  })
}

// Fetch devotional songs
async function fetchDevotionalSongs(sectionId, query, icon, color, title) {
  try {
    const response = await fetch(`https://saavn.dev/api/search/songs?query=${encodeURIComponent(query)}&limit=15`)
    const data = await response.json()

    if (data.data && data.data.results && data.data.results.length > 0) {
      renderDevotionalSection(sectionId, data.data.results, icon, color, title)
    }
  } catch (error) {
    console.error(`Error fetching ${query} songs:`, error)
  }
}

// Initialize category sections
function initializeCategorySections() {
  const categorySections = document.querySelectorAll(".category-section")

  categorySections.forEach((section) => {
    const query = section.dataset.query
    const title = section.dataset.title

    fetchCategorySongs(section.id, query, title)
  })
}

// Fetch category songs
async function fetchCategorySongs(sectionId, query, title) {
  try {
    const response = await fetch(`https://saavn.dev/api/search/songs?query=${encodeURIComponent(query)}&limit=20`)
    const data = await response.json()

    if (data.data && data.data.results && data.data.results.length > 0) {
      renderCategorySection(sectionId, data.data.results, title)
    }
  } catch (error) {
    console.error(`Error fetching ${query} songs:`, error)
  }
}

// Initialize English tracks sections
function initializeEnglishTracksSections() {
  const englishTracksSections = document.querySelectorAll(".english-tracks-section")

  englishTracksSections.forEach((section) => {
    const artist = section.dataset.artist
    const title = section.dataset.title

    fetchEnglishTracks(section.id, artist, title)
  })
}

// Fetch English tracks
async function fetchEnglishTracks(sectionId, artist, title) {
  try {
    const response = await fetch(`https://saavn.dev/api/search/songs?query=${encodeURIComponent(artist)}&limit=10`)
    const data = await response.json()

    if (data.data && data.data.results && data.data.results.length > 0) {
      renderEnglishTracksSection(sectionId, data.data.results, title, artist)
    }
  } catch (error) {
    console.error(`Error fetching ${artist} songs:`, error)
  }
}

// Render trending songs
function renderTrendingSongs() {
  if (!state.trendingSongs || state.trendingSongs.length === 0) return

  trendingContainer.innerHTML = state.trendingSongs
    .map(
      (song) => `
    <div class="flex-shrink-0 w-[250px] overflow-hidden border-none bg-card/50 hover:bg-card/80 transition-all duration-300 snap-start group">
      <div class="p-0 relative">
        <div class="relative aspect-square overflow-hidden">
          <img
            src="${song.image?.[2]?.url || "/placeholder.svg?height=250&width=250"}"
            alt="${cleanTitle(song.name)}"
            class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
          <div class="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
            <button
              class="h-12 w-12 rounded-full bg-primary text-primary-foreground shadow-lg transform translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 flex items-center justify-center"
              data-song-id="${song.id}"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="h-6 w-6">
                <polygon points="5 3 19 12 5 21 5 3"></polygon>
              </svg>
            </button>
          </div>
        </div>
        <div class="p-4">
          <h3 class="font-semibold truncate">${cleanTitle(song.name)}</h3>
          <p class="text-sm text-muted-foreground truncate">
            ${song.artists?.primary?.[0]?.name || "Unknown Artist"}
          </p>
        </div>
      </div>
    </div>
  `,
    )
    .join("")

  // Add event listeners to play buttons
  trendingContainer.querySelectorAll("button[data-song-id]").forEach((button) => {
    button.addEventListener("click", () => {
      const songId = button.dataset.songId
      const song = state.trendingSongs.find((s) => s.id === songId)
      if (song) {
        playSong(song)
      }
    })
  })
}

// Render top artists
function renderTopArtists(artists) {
  if (!artists) return

  const displayedArtists = state.showAllArtists ? artists : artists.slice(0, 12)

  topArtistsContainer.innerHTML = displayedArtists
    .map(
      (artist) => `
    <button class="flex flex-col items-center gap-3 group" data-artist-id="${artist.id}" data-artist-name="${artist.name}">
      <div class="w-24 h-24 rounded-full border-2 border-transparent group-hover:border-primary transition-all duration-300 overflow-hidden">
        <img
          src="${artist.image?.[2]?.url || "/placeholder.svg?height=96&width=96"}"
          alt="${artist.name}"
          class="w-full h-full object-cover"
        />
      </div>
      <div class="text-center">
        <h3 class="font-medium text-sm">${artist.name}</h3>
        <p class="text-xs text-muted-foreground">
          ${Number.parseInt(artist.followerCount).toLocaleString()} followers
        </p>
      </div>
    </button>
  `,
    )
    .join("")

  // Update show more/less button
  showMoreArtists.innerHTML = state.showAllArtists
    ? `<span>Show Less</span>
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="h-4 w-4">
      <path d="m18 15-6-6-6 6"></path>
    </svg>`
    : `<span>Show More</span>
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="h-4 w-4">
      <path d="m6 9 6 6 6-6"></path>
    </svg>`

  // Add event listeners to artist buttons
  topArtistsContainer.querySelectorAll("button[data-artist-id]").forEach((button) => {
    button.addEventListener("click", () => {
      const artistId = button.dataset.artistId
      const artistName = button.dataset.artistName
      selectArtist({ id: artistId, name: artistName })
    })
  })
}

// Render Shiva bhajans
function renderShivaBhajans(songs) {
  if (!songs || songs.length === 0) return

  shivaBhajansContainer.innerHTML = songs
    .map(
      (song) => `
    <div class="overflow-hidden border-none bg-card/50 hover:bg-card/80 transition-all duration-300">
      <div class="p-0">
        <div class="flex items-center gap-4 p-4">
          <div class="relative w-16 h-16 flex-shrink-0">
            <img
              src="${song.image?.[1]?.url || "/placeholder.svg?height=64&width=64"}"
              alt="${cleanTitle(song.name)}"
              class="w-full h-full object-cover rounded-md"
            />
            <button
              class="h-8 w-8 rounded-full bg-primary text-primary-foreground shadow-lg absolute inset-0 m-auto opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center"
              data-song-id="${song.id}"
              data-song-type="shiva"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="h-4 w-4">
                <polygon points="5 3 19 12 5 21 5 3"></polygon>
              </svg>
            </button>
          </div>

          <div class="flex-1 min-w-0">
            <h3 class="font-medium truncate">${cleanTitle(song.name)}</h3>
            <p class="text-sm text-muted-foreground truncate">
              ${song.artists?.primary?.[0]?.name || "Unknown Artist"}
            </p>
          </div>
        </div>
      </div>
    </div>
  `,
    )
    .join("")

  // Store songs in state
  state.shivaBhajans = songs

  // Add event listeners to play buttons
  shivaBhajansContainer.querySelectorAll("button[data-song-id]").forEach((button) => {
    button.addEventListener("click", () => {
      const songId = button.dataset.songId
      const song = state.shivaBhajans.find((s) => s.id === songId)
      if (song) {
        playSong(song)
      }
    })
  })
}

// Render Durga bhajans
function renderDurgaBhajans() {
  if (!state.durgaBhajans || state.durgaBhajans.length === 0) return

  const displayedSongs = state.showAllDurgaBhajans ? state.durgaBhajans : state.durgaBhajans.slice(0, 9)

  durgaBhajansContainer.innerHTML = displayedSongs
    .map(
      (song) => `
    <div class="overflow-hidden border-none bg-card/50 hover:bg-card/80 transition-all duration-300">
      <div class="p-0">
        <div class="flex items-center gap-4 p-4">
          <div class="relative w-16 h-16 flex-shrink-0">
            <img
              src="${song.image?.[1]?.url || "/placeholder.svg?height=64&width=64"}"
              alt="${cleanTitle(song.name)}"
              class="w-full h-full object-cover rounded-md"
            />
            <button
              class="h-8 w-8 rounded-full bg-primary text-primary-foreground shadow-lg absolute inset-0 m-auto opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center"
              data-song-id="${song.id}"
              data-song-type="durga"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="h-4 w-4">
                <polygon points="5 3 19 12 5 21 5 3"></polygon>
              </svg>
            </button>
          </div>

          <div class="flex-1 min-w-0">
            <h3 class="font-medium truncate">${cleanTitle(song.name)}</h3>
            <p class="text-sm text-muted-foreground truncate">
              ${song.artists?.primary?.[0]?.name || "Unknown Artist"}
            </p>
          </div>
        </div>
      </div>
    </div>
  `,
    )
    .join("")

  // Update show more/less button
  showMoreDurga.innerHTML = state.showAllDurgaBhajans
    ? `<span>Show Less</span>
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="h-4 w-4">
      <path d="m18 15-6-6-6 6"></path>
    </svg>`
    : `<span>Show More</span>
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="h-4 w-4">
      <path d="m6 9 6 6 6-6"></path>
    </svg>`

  // Add event listeners to play buttons
  durgaBhajansContainer.querySelectorAll("button[data-song-id]").forEach((button) => {
    button.addEventListener("click", () => {
      const songId = button.dataset.songId
      const song = state.durgaBhajans.find((s) => s.id === songId)
      if (song) {
        playSong(song)
      }
    })
  })
}

// Render devotional section
function renderDevotionalSection(sectionId, songs, icon, color, title) {
  const section = document.getElementById(sectionId)
  if (!section || !songs || songs.length === 0) return

  section.innerHTML = `
    <div class="flex items-center justify-between mb-4">
      <div class="flex items-center gap-3">
        <div class="w-10 h-10 rounded-full flex items-center justify-center bg-gradient-to-br ${color}">
          <span class="text-lg">${icon}</span>
        </div>
        <h2 class="text-2xl font-bold">${title}</h2>
      </div>
      <div class="flex items-center gap-4">
        <button class="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90" data-play-all="${sectionId}">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="h-4 w-4">
            <polygon points="5 3 19 12 5 21 5 3"></polygon>
          </svg>
          <span>Play All</span>
        </button>
        <div class="flex items-center gap-2">
          <button class="rounded-full p-2 border border-border hover:bg-accent" data-scroll-left="${sectionId}">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="h-5 w-5">
              <path d="m15 18-6-6 6-6"></path>
            </svg>
          </button>
          <button class="rounded-full p-2 border border-border hover:bg-accent" data-scroll-right="${sectionId}">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="h-5 w-5">
              <path d="m9 18 6-6-6-6"></path>
            </svg>
          </button>
        </div>
      </div>
    </div>

    <div class="flex gap-4 overflow-x-auto pb-4 scrollbar-hide snap-x" id="${sectionId}-container">
      ${songs
        .map(
          (song) => `
        <div class="flex-shrink-0 w-[250px] overflow-hidden border-none bg-card/50 hover:bg-card/80 transition-all duration-300 snap-start group">
          <div class="p-0 relative">
            <div class="relative aspect-square overflow-hidden">
              <img
                src="${song.image?.[2]?.url || "/placeholder.svg?height=250&width=250"}"
                alt="${cleanTitle(song.name)}"
                class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div class="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                <button
                  class="h-12 w-12 rounded-full bg-primary text-primary-foreground shadow-lg transform translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 flex items-center justify-center"
                  data-song-id="${song.id}"
                  data-section="${sectionId}"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="h-6 w-6">
                    <polygon points="5 3 19 12 5 21 5 3"></polygon>
                  </svg>
                </button>
              </div>
            </div>
            <div class="p-4">
              <h3 class="font-semibold truncate">${cleanTitle(song.name)}</h3>
              <p class="text-sm text-muted-foreground truncate">
                ${song.artists?.primary?.[0]?.name || "Unknown Artist"}
              </p>
            </div>
          </div>
        </div>
      `,
        )
        .join("")}
    </div>
  `

  // Store songs in state
  state[sectionId] = songs

  // Add event listeners
  const container = document.getElementById(`${sectionId}-container`)
  const scrollLeftBtn = section.querySelector(`button[data-scroll-left="${sectionId}"]`)
  const scrollRightBtn = section.querySelector(`button[data-scroll-right="${sectionId}"]`)
  const playAllBtn = section.querySelector(`button[data-play-all="${sectionId}"]`)

  scrollLeftBtn.addEventListener("click", () => {
    container.scrollBy({ left: -container.clientWidth, behavior: "smooth" })
  })

  scrollRightBtn.addEventListener("click", () => {
    container.scrollBy({ left: container.clientWidth, behavior: "smooth" })
  })

  playAllBtn.addEventListener("click", () => {
    playAllSongs(sectionId)
  })

  // Add event listeners to play buttons
  section.querySelectorAll(`button[data-song-id][data-section="${sectionId}"]`).forEach((button) => {
    button.addEventListener("click", () => {
      const songId = button.dataset.songId
      const song = state[sectionId].find((s) => s.id === songId)
      if (song) {
        playSong(song)
      }
    })
  })
}

// Render category section
function renderCategorySection(sectionId, songs, title) {
  const section = document.getElementById(sectionId)
  if (!section || !songs || songs.length === 0) return

  section.innerHTML = `
    <div class="flex items-center justify-between mb-4">
      <h2 class="text-2xl font-bold">${title}</h2>
      <div class="flex items-center gap-4">
        <button class="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90" data-play-all="${sectionId}">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="h-4 w-4">
            <polygon points="5 3 19 12 5 21 5 3"></polygon>
          </svg>
          <span>Play All</span>
        </button>
        <div class="flex items-center gap-2">
          <button class="rounded-full p-2 border border-border hover:bg-accent" data-scroll-left="${sectionId}">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="h-5 w-5">
              <path d="m15 18-6-6 6-6"></path>
            </svg>
          </button>
          <button class="rounded-full p-2 border border-border hover:bg-accent" data-scroll-right="${sectionId}">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="h-5 w-5">
              <path d="m9 18 6-6-6-6"></path>
            </svg>
          </button>
        </div>
      </div>
    </div>

    <div class="flex gap-4 overflow-x-auto pb-4 scrollbar-hide snap-x" id="${sectionId}-container">
      ${songs
        .map(
          (song) => `
        <div class="flex-shrink-0 w-[250px] overflow-hidden border-none bg-card/50 hover:bg-card/80 transition-all duration-300 snap-start group">
          <div class="p-0 relative">
            <div class="relative aspect-square overflow-hidden">
              <img
                src="${song.image?.[2]?.url || "/placeholder.svg?height=250&width=250"}"
                alt="${cleanTitle(song.name)}"
                class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div class="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                <button
                  class="h-12 w-12 rounded-full bg-primary text-primary-foreground shadow-lg transform translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 flex items-center justify-center"
                  data-song-id="${song.id}"
                  data-section="${sectionId}"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="h-6 w-6">
                    <polygon points="5 3 19 12 5 21 5 3"></polygon>
                  </svg>
                </button>
              </div>
            </div>
            <div class="p-4">
              <h3 class="font-semibold truncate">${cleanTitle(song.name)}</h3>
              <p class="text-sm text-muted-foreground truncate">
                ${song.artists?.primary?.[0]?.name || "Unknown Artist"}
              </p>
            </div>
          </div>
        </div>
      `,
        )
        .join("")}
    </div>
  `

  // Store songs in state
  state[sectionId] = songs

  // Add event listeners
  const container = document.getElementById(`${sectionId}-container`)
  const scrollLeftBtn = section.querySelector(`button[data-scroll-left="${sectionId}"]`)
  const scrollRightBtn = section.querySelector(`button[data-scroll-right="${sectionId}"]`)
  const playAllBtn = section.querySelector(`button[data-play-all="${sectionId}"]`)

  scrollLeftBtn.addEventListener("click", () => {
    container.scrollBy({ left: -container.clientWidth, behavior: "smooth" })
  })

  scrollRightBtn.addEventListener("click", () => {
    container.scrollBy({ left: container.clientWidth, behavior: "smooth" })
  })

  playAllBtn.addEventListener("click", () => {
    playAllSongs(sectionId)
  })

  // Add event listeners to play buttons
  section.querySelectorAll(`button[data-song-id][data-section="${sectionId}"]`).forEach((button) => {
    button.addEventListener("click", () => {
      const songId = button.dataset.songId
      const song = state[sectionId].find((s) => s.id === songId)
      if (song) {
        playSong(song)
      }
    })
  })
}

// Render English tracks section
function renderEnglishTracksSection(sectionId, songs, title, artist) {
  const section = document.getElementById(sectionId)
  if (!section || !songs || songs.length === 0) return

  section.innerHTML = `
    <div class="flex items-center justify-between mb-4">
      <h2 class="text-2xl font-bold">${title}</h2>
      <div class="flex items-center gap-4">
        <button class="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90" data-play-all="${sectionId}">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="h-4 w-4">
            <polygon points="5 3 19 12 5 21 5 3"></polygon>
          </svg>
          <span>Play All</span>
        </button>
        <div class="flex items-center gap-2">
          <button class="rounded-full p-2 border border-border hover:bg-accent" data-scroll-left="${sectionId}">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="h-5 w-5">
              <path d="m15 18-6-6 6-6"></path>
            </svg>
          </button>
          <button class="rounded-full p-2 border border-border hover:bg-accent" data-scroll-right="${sectionId}">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="h-5 w-5">
              <path d="m9 18 6-6-6-6"></path>
            </svg>
          </button>
        </div>
      </div>
    </div>

    <div class="flex gap-4 overflow-x-auto pb-4 scrollbar-hide snap-x" id="${sectionId}-container">
      ${songs
        .map(
          (song) => `
        <div class="flex-shrink-0 w-[250px] overflow-hidden border-none bg-card/50 hover:bg-card/80 transition-all duration-300 snap-start group">
          <div class="p-0 relative">
            <div class="relative aspect-square overflow-hidden">
              <img
                src="${song.image?.[2]?.url || "/placeholder.svg?height=250&width=250"}"
                alt="${cleanTitle(song.name)}"
                class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div class="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                <button
                  class="h-12 w-12 rounded-full bg-primary text-primary-foreground shadow-lg transform translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 flex items-center justify-center"
                  data-song-id="${song.id}"
                  data-section="${sectionId}"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="h-6 w-6">
                    <polygon points="5 3 19 12 5 21 5 3"></polygon>
                  </svg>
                </button>
              </div>
            </div>
            <div class="p-4">
              <h3 class="font-semibold truncate">${cleanTitle(song.name)}</h3>
              <p class="text-sm text-muted-foreground truncate">
                ${song.artists?.primary?.[0]?.name || artist}
              </p>
            </div>
          </div>
        </div>
      `,
        )
        .join("")}
    </div>
  `

  // Store songs in state
  state[sectionId] = songs

  // Add event listeners
  const container = document.getElementById(`${sectionId}-container`)
  const scrollLeftBtn = section.querySelector(`button[data-scroll-left="${sectionId}"]`)
  const scrollRightBtn = section.querySelector(`button[data-scroll-right="${sectionId}"]`)
  const playAllBtn = section.querySelector(`button[data-play-all="${sectionId}"]`)

  scrollLeftBtn.addEventListener("click", () => {
    container.scrollBy({ left: -container.clientWidth, behavior: "smooth" })
  })

  scrollRightBtn.addEventListener("click", () => {
    container.scrollBy({ left: container.clientWidth, behavior: "smooth" })
  })

  playAllBtn.addEventListener("click", () => {
    playAllSongs(sectionId)
  })

  // Add event listeners to play buttons
  section.querySelectorAll(`button[data-song-id][data-section="${sectionId}"]`).forEach((button) => {
    button.addEventListener("click", () => {
      const songId = button.dataset.songId
      const song = state[sectionId].find((s) => s.id === songId)
      if (song) {
        playSong(song)
      }
    })
  })
}

// Handle search
async function handleSearch() {
  const query = searchInput.value.trim()

  if (query.length < 3) {
    searchResults.classList.add("hidden")
    return
  }

  try {
    const response = await fetch(`https://saavn.dev/api/search?query=${encodeURIComponent(query)}`)
    const data = await response.json()

    if (data.data && data.data.songs && data.data.songs.results) {
      renderSearchResults(data.data.songs.results)
      searchResults.classList.remove("hidden")
    }
  } catch (error) {
    console.error("Error searching:", error)
  }
}

// Render search results
function renderSearchResults(results) {
  if (!results || results.length === 0) {
    searchResultsContainer.innerHTML = '<p class="p-4 text-center text-muted-foreground">No results found</p>'
    return
  }

  searchResultsContainer.innerHTML = results
    .map(
      (result) => `
    <button class="flex items-center gap-3 w-full p-2 text-sm hover:bg-accent hover:text-accent-foreground rounded-md" data-song-id="${result.id}">
      ${
        result.image
          ? `
        <img
          src="${result.image[0].url || "/placeholder.svg"}"
          alt="${result.title}"
          class="h-10 w-10 rounded object-cover"
        />
      `
          : ""
      }
      <div class="text-left">
        <p class="font-medium truncate">${result.title}</p>
        <p class="text-xs text-muted-foreground truncate">${result.primaryArtists}</p>
      </div>
    </button>
  `,
    )
    .join("")

  // Add event listeners to search result buttons
  searchResultsContainer.querySelectorAll("button[data-song-id]").forEach((button) => {
    button.addEventListener("click", async () => {
      const songId = button.dataset.songId
      try {
        const response = await fetch(`https://saavn.dev/api/songs/${songId}`)
        const data = await response.json()
        if (data.data && data.data[0]) {
          playSong(data.data[0])
          searchResults.classList.add("hidden")
          searchInput.value = ""
        }
      } catch (error) {
        console.error("Error fetching song:", error)
      }
    })
  })
}

// Select artist
async function selectArtist(artist) {
  state.selectedArtist = artist
  artistName.textContent = `Artist: ${artist.name}`

  // Show artist page
  homePage.classList.add("hidden")
  artistPage.classList.remove("hidden")

  // Show loading state
  artistSongsContainer.innerHTML = `
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      ${Array(9)
        .fill()
        .map(
          () => `
        <div class="flex gap-4 items-center">
          <div class="w-16 h-16 bg-muted animate-pulse rounded-md"></div>
          <div class="flex-1">
            <div class="h-4 w-3/4 bg-muted animate-pulse rounded"></div>
            <div class="h-3 w-1/2 bg-muted animate-pulse rounded mt-2"></div>
          </div>
        </div>
      `,
        )
        .join("")}
    </div>
  `

  // Fetch artist songs
  try {
    const response = await fetch(`https://saavn.dev/api/search/songs?query=${encodeURIComponent(artist.name)}&limit=30`)
    const data = await response.json()

    if (data.data && data.data.results) {
      // Filter songs to only include those by this artist
      const artistSongs = data.data.results.filter((song) =>
        song.artists?.primary?.some((a) => a.name.toLowerCase().includes(artist.name.toLowerCase())),
      )

      renderArtistSongs(artistSongs)
    }
  } catch (error) {
    console.error("Error fetching artist songs:", error)
    artistSongsContainer.innerHTML = `
      <div class="text-center py-12">
        <h3 class="text-xl font-medium">Error loading songs</h3>
        <p class="text-muted-foreground mt-2">Please try again later</p>
      </div>
    `
  }
}

// Render artist songs
function renderArtistSongs(songs) {
  if (!songs || songs.length === 0) {
    artistSongsContainer.innerHTML = `
      <div class="text-center py-12">
        <h3 class="text-xl font-medium">No songs found for this artist</h3>
        <p class="text-muted-foreground mt-2">Try searching for another artist</p>
      </div>
    `
    return
  }

  artistSongsContainer.innerHTML = `
    <div class="flex justify-between items-center mb-6">
      <h3 class="text-xl font-medium">
        ${songs.length} songs by ${state.selectedArtist.name}
      </h3>
      <button id="play-all-artist" class="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90">
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="h-4 w-4">
          <polygon points="5 3 19 12 5 21 5 3"></polygon>
        </svg>
        <span>Play All</span>
      </button>
    </div>
    
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      ${songs
        .map(
          (song) => `
        <div class="overflow-hidden border-none bg-card/50 hover:bg-card/80 transition-all duration-300">
          <div class="p-0">
            <div class="flex items-center gap-4 p-4">
              <div class="relative w-16 h-16 flex-shrink-0">
                <img
                  src="${song.image?.[1]?.url || "/placeholder.svg?height=64&width=64"}"
                  alt="${cleanTitle(song.name)}"
                  class="w-full h-full object-cover rounded-md"
                />
                <button
                  class="h-8 w-8 rounded-full bg-primary text-primary-foreground shadow-lg absolute inset-0 m-auto opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center"
                  data-song-id="${song.id}"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="h-4 w-4">
                    <polygon points="5 3 19 12 5 21 5 3"></polygon>
                  </svg>
                </button>
              </div>

              <div class="flex-1 min-w-0">
                <h3 class="font-medium truncate">${cleanTitle(song.name)}</h3>
                <p class="text-sm text-muted-foreground truncate">
                  ${song.album?.name || "Single"}
                </p>
              </div>

              <button class="flex-shrink-0 rounded-full p-2 hover:bg-accent" data-like-song-id="${song.id}">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="h-5 w-5">
                  <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"></path>
                </svg>
              </button>
            </div>
          </div>
        </div>
      `,
        )
        .join("")}
    </div>
  `

  // Store artist songs in state
  state.artistSongs = songs

  // Add event listeners
  document.getElementById("play-all-artist").addEventListener("click", () => {
    playAllSongs("artistSongs")
  })

  // Add event listeners to play buttons
  artistSongsContainer.querySelectorAll("button[data-song-id]").forEach((button) => {
    button.addEventListener("click", () => {
      const songId = button.dataset.songId
      const song = state.artistSongs.find((s) => s.id === songId)
      if (song) {
        playSong(song)
      }
    })
  })

  // Add event listeners to like buttons
  artistSongsContainer.querySelectorAll("button[data-like-song-id]").forEach((button) => {
    button.addEventListener("click", () => {
      const songId = button.dataset.likeSongId
      const song = state.artistSongs.find((s) => s.id === songId)
      if (song) {
        toggleLikeSong(song, button)
      }
    })
  })
}

// Play song
function playSong(song) {
  state.currentSong = song

  // Update audio source
  audioPlayer.src = song.downloadUrl?.[4]?.url || song.downloadUrl?.[0]?.url || ""
  audioPlayer.play().catch((err) => console.error("Error playing audio:", err))
  state.isPlaying = true

  // Update player UI
  updatePlayerUI()

  // Add to recently played
  addToRecentlyPlayed(song)
}

// Play all songs in a section
function playAllSongs(sectionId) {
  const songs = state[sectionId];
  if (!songs || songs.length === 0) return;
  
  // Play the first song
  playSong(songs[0]);
  
  // Add the rest to the queue
  // Add the rest to the queue
  if (songs.length > 1) {
    state.queue = songs.slice(1);
  }
}

// Update player UI
function updatePlayerUI() {
  if (!state.currentSong) return;

  // Mini player
  miniPlayerImage.src = state.currentSong.image?.[1]?.url || "/placeholder.svg?height=48&width=48";
  miniPlayerTitle.textContent = cleanTitle(state.currentSong.name);
  miniPlayerArtist.textContent = state.currentSong.artists?.primary?.[0]?.name || "Unknown Artist";

  // Full player
  fullPlayerImage.src = state.currentSong.image?.[2]?.url || "/placeholder.svg?height=400&width=400";
  fullPlayerTitle.textContent = cleanTitle(state.currentSong.name);
  fullPlayerArtist.textContent = state.currentSong.artists?.primary?.[0]?.name || "Unknown Artist";

  // Update play/pause buttons
  updatePlayPauseButtons();

  // Update document title
  document.title = `${cleanTitle(state.currentSong.name)} - Songify`;
}

// Update play/pause buttons
function updatePlayPauseButtons() {
  if (state.isPlaying) {
    miniPlayerPlay.innerHTML = `
      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="h-5 w-5">
        <rect x="6" y="4" width="4" height="16"></rect>
        <rect x="14" y="4" width="4" height="16"></rect>
      </svg>
    `;
    fullPlayerPlay.innerHTML = `
      <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="h-7 w-7">
        <rect x="6" y="4" width="4" height="16"></rect>
        <rect x="14" y="4" width="4" height="16"></rect>
      </svg>
    `;
  } else {
    miniPlayerPlay.innerHTML = `
      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="h-5 w-5 ml-0.5">
        <polygon points="5 3 19 12 5 21 5 3"></polygon>
      </svg>
    `;
    fullPlayerPlay.innerHTML = `
      <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="h-7 w-7 ml-0.5">
        <polygon points="5 3 19 12 5 21 5 3"></polygon>
      </svg>
    `;
  }
}

// Toggle play/pause
function togglePlayPause() {
  if (!state.currentSong) {
    // If nothing is playing, play the first trending song
    if (state.trendingSongs.length > 0) {
      playSong(state.trendingSongs[0]);
    }
    return;
  }

  if (state.isPlaying) {
    audioPlayer.pause();
    state.isPlaying = false;
  } else {
    audioPlayer.play().catch(err => console.error("Error playing audio:", err));
    state.isPlaying = true;
  }
  updatePlayPauseButtons();
}

// Play next song
function playNextSong() {
  if (state.queue.length > 0) {
    const nextSong = state.queue.shift();
    playSong(nextSong);
  } else {
    // If queue is empty, stop playback
    audioPlayer.pause();
    state.isPlaying = false;
    updatePlayPauseButtons();
  }
}

// Play previous song
function playPreviousSong() {
  if (state.recentlyPlayed.length > 1) {
    // Get the second last played song (last is current)
    const prevSong = state.recentlyPlayed[state.recentlyPlayed.length - 2];
    playSong(prevSong);
  }
}

// Add to recently played
function addToRecentlyPlayed(song) {
  // Remove if already exists
  state.recentlyPlayed = state.recentlyPlayed.filter(s => s.id !== song.id);
  // Add to beginning
  state.recentlyPlayed.unshift(song);
  // Keep only last 10
  if (state.recentlyPlayed.length > 10) {
    state.recentlyPlayed.pop();
  }

  // Update recently played UI if on home page
  if (!artistPage.classList.contains("hidden")) return;
  
  renderRecentlyPlayed();
}

// Render recently played
function renderRecentlyPlayed() {
  if (state.recentlyPlayed.length === 0) {
    recentlyPlayedSection.classList.add("hidden");
    return;
  }

  recentlyPlayedSection.classList.remove("hidden");
  recentlyPlayedContainer.innerHTML = state.recentlyPlayed
    .slice(0, 6) // Show only first 6
    .map(
      (song) => `
    <div class="overflow-hidden border-none bg-card/50 hover:bg-card/80 transition-all duration-300">
      <div class="p-0">
        <div class="flex items-center gap-4 p-4">
          <div class="relative w-16 h-16 flex-shrink-0">
            <img
              src="${song.image?.[1]?.url || "/placeholder.svg?height=64&width=64"}"
              alt="${cleanTitle(song.name)}"
              class="w-full h-full object-cover rounded-md"
            />
            <button
              class="h-8 w-8 rounded-full bg-primary text-primary-foreground shadow-lg absolute inset-0 m-auto opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center"
              data-song-id="${song.id}"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="h-4 w-4">
                <polygon points="5 3 19 12 5 21 5 3"></polygon>
              </svg>
            </button>
          </div>

          <div class="flex-1 min-w-0">
            <h3 class="font-medium truncate">${cleanTitle(song.name)}</h3>
            <p class="text-sm text-muted-foreground truncate">
              ${song.artists?.primary?.[0]?.name || "Unknown Artist"}
            </p>
          </div>
        </div>
      </div>
    </div>
  `
    )
    .join("");

  // Add event listeners to play buttons
  recentlyPlayedContainer.querySelectorAll("button[data-song-id]").forEach((button) => {
    button.addEventListener("click", () => {
      const songId = button.dataset.songId;
      const song = state.recentlyPlayed.find((s) => s.id === songId);
      if (song) {
        playSong(song);
      }
    });
  });
}

// Toggle like
function toggleLike() {
  if (!state.currentSong) return;

  const songId = state.currentSong.id;
  const isLiked = state.likedSongs.some(song => song.id === songId);

  if (isLiked) {
    state.likedSongs = state.likedSongs.filter(song => song.id !== songId);
  } else {
    state.likedSongs.push(state.currentSong);
  }

  updateLikeButtons();
}

// Toggle like for specific song
function toggleLikeSong(song, button) {
  const isLiked = state.likedSongs.some(s => s.id === song.id);

  if (isLiked) {
    state.likedSongs = state.likedSongs.filter(s => s.id !== song.id);
    button.innerHTML = `
      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="h-5 w-5">
        <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"></path>
      </svg>
    `;
  } else {
    state.likedSongs.push(song);
    button.innerHTML = `
      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="h-5 w-5 text-red-500">
        <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"></path>
      </svg>
    `;
  }

  // If this is the current song, update the player buttons
  if (state.currentSong && state.currentSong.id === song.id) {
    updateLikeButtons();
  }
}

// Update like buttons
function updateLikeButtons() {
  const isLiked = state.currentSong && state.likedSongs.some(song => song.id === state.currentSong.id);

  miniPlayerLike.innerHTML = isLiked
    ? `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="h-5 w-5 text-red-500">
        <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"></path>
      </svg>`
    : `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="h-5 w-5">
        <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"></path>
      </svg>`;

  fullPlayerLike.innerHTML = isLiked
    ? `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="h-6 w-6 text-red-500">
        <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"></path>
      </svg>`
    : `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="h-6 w-6">
        <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"></path>
      </svg>`;
}

// Expand player
function expandPlayer() {
  fullPlayer.classList.remove("translate-y-full");
  fullPlayer.classList.add("translate-y-0");
}

// Minimize player
function minimizePlayer() {
  fullPlayer.classList.remove("translate-y-0");
  fullPlayer.classList.add("translate-y-full");
}

// Toggle mute
function toggleMute() {
  if (audioPlayer.volume > 0) {
    audioPlayer.volume = 0;
    volumeBar.style.width = "0%";
    volumeToggle.innerHTML = `
      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="h-5 w-5">
        <path d="M16 21c-2.5 2-5.36 2.5-8 3-3.5.5-6-.5-7-1l2-2c1.5 0 3-.5 4-1 2-1 3.5-2.5 5-3.5"></path>
        <path d="M17 17c0-1.5.5-3 1-4 1-2 2.5-3.5 3.5-4.5"></path>
        <path d="M17 6V3l5 5"></path>
        <path d="m12 8-3 2"></path>
        <path d="m2 2 20 20"></path>
        <path d="M10.3 5.3a6.6 6.6 0 0 1 2.7 1.7"></path>
      </svg>
    `;
  } else {
    audioPlayer.volume = state.volume;
    volumeBar.style.width = `${state.volume * 100}%`;
    volumeToggle.innerHTML = `
      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="h-5 w-5">
        <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>
        <path d="M15.54 8.46a5 5 0 0 1 0 7.07"></path>
        <path d="M19.07 4.93a10 10 0 0 1 0 14.14"></path>
      </svg>
    `;
  }
}

// Toggle audio visualizer
function toggleAudioVisualizer() {
  if (state.visualizerActive) {
    // Stop visualizer
    cancelAnimationFrame(state.animationFrame);
    visualizerContainer.classList.add("hidden");
    toggleVisualizer.textContent = "Show Visualizer";
    state.visualizerActive = false;
  } else {
    // Start visualizer
    if (!state.audioContext) {
      setupAudioContext();
    }
    visualizerContainer.classList.remove("hidden");
    toggleVisualizer.textContent = "Hide Visualizer";
    state.visualizerActive = true;
    drawVisualizer();
  }
}

// Setup audio context for visualizer
function setupAudioContext() {
  state.audioContext = new (window.AudioContext || window.webkitAudioContext)();
  state.analyser = state.audioContext.createAnalyser();
  state.analyser.fftSize = 256;

  const source = state.audioContext.createMediaElementSource(audioPlayer);
  source.connect(state.analyser);
  state.analyser.connect(state.audioContext.destination);

  state.dataArray = new Uint8Array(state.analyser.frequencyBinCount);
}

// Draw visualizer
function drawVisualizer() {
  if (!state.visualizerActive) return;

  state.animationFrame = requestAnimationFrame(drawVisualizer);

  const canvas = document.getElementById("visualizer");
  const ctx = canvas.getContext("2d");
  const width = canvas.width;
  const height = canvas.height;

  state.analyser.getByteFrequencyData(state.dataArray);

  ctx.clearRect(0, 0, width, height);

  const barWidth = (width / state.analyser.frequencyBinCount) * 2.5;
  let x = 0;

  for (let i = 0; i < state.analyser.frequencyBinCount; i++) {
    const barHeight = (state.dataArray[i] / 255) * height;

    const hue = i / state.analyser.frequencyBinCount * 360;
    ctx.fillStyle = `hsla(${hue}, 100%, 50%, 0.8)`;
    ctx.fillRect(x, height - barHeight, barWidth, barHeight);

    x += barWidth + 1;
  }
}

// Update progress bar
function updateProgress() {
  if (!isNaN(audioPlayer.duration)) {
    const progress = (audioPlayer.currentTime / audioPlayer.duration) * 100;
    progressBar.style.width = `${progress}%`;
    fullPlayerProgress.style.width = `${progress}%`;

    currentTimeDisplay.textContent = formatTime(audioPlayer.currentTime);
    fullPlayerCurrentTime.textContent = formatTime(audioPlayer.currentTime);
  }
}

// Update duration display
function updateDurationDisplay() {
  if (!isNaN(audioPlayer.duration)) {
    durationDisplay.textContent = formatTime(audioPlayer.duration);
    fullPlayerDuration.textContent = formatTime(audioPlayer.duration);
  }
}

// Format time (seconds to MM:SS)
function formatTime(seconds) {
  if (isNaN(seconds)) return "0:00";

  const minutes = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${minutes}:${secs < 10 ? "0" : ""}${secs}`;
}

// Debounce function for search
function debounce(func, wait) {
  let timeout;
  return function() {
    const context = this;
    const args = arguments;
    clearTimeout(timeout);
    timeout = setTimeout(() => {
      func.apply(context, args);
    }, wait);
  };
}

// Clean song title
function cleanTitle(title) {
  if (!title) return "Unknown Track";
  return title
    .replace(/&quot;/g, '"')
    .replace(/\s*\(.*?\)\s*/g, "")
    .trim();
}

// Keyboard shortcuts
document.addEventListener("keydown", (e) => {
  // Space to play/pause (unless focused on an input)
  if (e.code === "Space" && !["INPUT", "TEXTAREA"].includes(e.target.tagName)) {
    e.preventDefault();
    togglePlayPause();
  }

  // Right arrow to skip forward 5 seconds
  if (e.code === "ArrowRight") {
    if (!isNaN(audioPlayer.duration)) {
      audioPlayer.currentTime = Math.min(audioPlayer.currentTime + 5, audioPlayer.duration);
    }
  }

  // Left arrow to rewind 5 seconds
  if (e.code === "ArrowLeft") {
    audioPlayer.currentTime = Math.max(audioPlayer.currentTime - 5, 0);
  }

  // Up arrow to increase volume
  if (e.code === "ArrowUp") {
    state.volume = Math.min(state.volume + 0.1, 1);
    audioPlayer.volume = state.volume;
    volumeBar.style.width = `${state.volume * 100}%`;
  }

  // Down arrow to decrease volume
  if (e.code === "ArrowDown") {
    state.volume = Math.max(state.volume - 0.1, 0);
    audioPlayer.volume = state.volume;
    volumeBar.style.width = `${state.volume * 100}%`;
  }

  // M to toggle mute
  if (e.code === "KeyM") {
    toggleMute();
  }

  // F to toggle fullscreen player
  if (e.code === "KeyF") {
    if (fullPlayer.classList.contains("translate-y-full")) {
      expandPlayer();
    } else {
      minimizePlayer();
    }
  }

  // L to toggle like
  if (e.code === "KeyL") {
    toggleLike();
  }

  // V to toggle visualizer
  if (e.code === "KeyV") {
    toggleAudioVisualizer();
  }
});
