const postAPI = "https://thanh6886.github.io/usersAPI/usersAPI.json";

const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);
const playlist = $(".playlist");

const reload = $(".reloadButton");
const player = $(".player");

const cd = $(".cd");
const cdThumb = $(".cd-thumb");

const heading = $("header h2"); //
const nowPlaying = $("header h4"); //

const audio = $("#audio"); //
const playBtn = $(".btn-toggle-play"); // nút play
const progress = $("#progress"); // thanh input
const prevBtn = $(".btn-prev"); //  nút ngược lại
const nextBtn = $(".btn-next"); // nút next
const randomBtn = $(".btn-random");
const repeatBtn = $(".btn-repeat");

const _volume = $("._volume");
const currentVolume = $("#currentVolume");

const start_Time = $(".start_time");
const end_Time = $(".end_time");

let isPlaying = false;
let isRepeatBtn = false;
let isRandom = false;

const cdWidth = cd.offsetWidth;
const cdThumbAnimate = cdThumb.animate([{ transform: "rotate(360deg)" }], {
  duration: 25000,
  iterations: Infinity,
});
cdThumbAnimate.pause(); // quay đĩa cd chỉnh animate

function cdRun() {
  if (isPlaying == true) {
    cdThumbAnimate.play(); // đĩa CD QUAY
  } else {
    cdThumbAnimate.pause();
  }
}

function getCourses(callback) {
  fetch(postAPI) // lấy api từ json sever
    .then((data) => {
      return data.json(); // data trả về 1 mảng gồm các obj
    })
    .then(callback)
    .catch((err) => {
      let mess = confirm("không gọi dc api bấm ok để load lại");
      if (mess == true) {
        window.location.reload();
      }
    });
}

function render(data) {
  // lấy danh sách bài hát từ api dùng map để load ra mảng
  const HTML = data.map((song, index) => {
    return `
             <div class="song ${
               index === this.currentIndex ? "active" : "" // thêm index
             }" data-index="${index}">
                   <div class="thumb"
                         style="background-image: url('${song.image}')">
                   </div>
                   <div class="body">
                         <h3 class="title">${song.name}</h3>
                         <p class="author">${song.singer}</p>
                   </div>
                <div class="option">
                         <i class="fas fa-ellipsis-h"></i>
                </div>
            </div>`;
  });
  playlist.innerHTML = HTML.join(""); // gắn nhúng vào HTML
}
function loadSong(data) {
  const a = localStorage.getItem("count");
  const count = a === null ? 0 : a;
  const currentsong = data[count];
  audio.src = currentsong.path;
  heading.innerText = currentsong.name;
  cdThumb.style.backgroundImage = `url(${currentsong.image})`;
}
playBtn.onclick = function play_pause_Track() {
  //  sử lý sự kiện khi bấm play và khi bấm pause
  isPlaying ? pauseSound() : playSound();
  cdRun();
};
function playSound() {
  // khi bài hát play
  audio.play();
  isPlaying = true;
  nowPlaying.innerText = "PLAYING >_<";
  playBtn.innerHTML = '<i class="fa fa-pause-circle fa-3x"></i>';
}
function pauseSound() {
  // khi bài hat pause
  audio.pause();
  isPlaying = false;
  nowPlaying.innerText = "NOW PLAYING ?";
  playBtn.innerHTML = '<i class="fa fa-play-circle fa-3x"></i>';
}
repeatBtn.onclick = function () {
  // sự kiện khi bấm nút repeat
  isRepeatBtn = !isRepeatBtn;
  console.log(isRepeatBtn);
  if (isRepeatBtn == false) {
    repeatBtn.innerHTML = '<i class="fas fa-redo fa-2x"></i>';
  } else {
    repeatBtn.innerHTML =
      '<i class="fas fa-redo fa-2x" style="color: brown;"></i>';
  }
};

randomBtn.onclick = function () {
  // sự kiện khi bấm  nút random

  isRandom = !isRandom;
  console.log(isRandom);
  if (isRandom == false) {
    randomBtn.innerHTML = '<i class="fas fa-random fa-2x"></i>';
  } else {
    randomBtn.innerHTML =
      '<i class="fas fa-random fa-2x" style="color: brown;"></i>';
  }
};

_volume.addEventListener("input", (e) => {
  // sự kiện chỉnh thanh âm thanh
  var Volume = e.target.value;
  currentVolume.innerText = parseInt(Volume * 100);
  audio.volume = Volume;
});

progress.onchange = function () {
  // bắt sự kiện sử lý khi tua thanh input
  const seekto = audio.duration * (progress.value / 100);
  audio.currentTime = seekto;
};
audio.ontimeupdate = function () {
  // bắt sự kiện khi bài hát chạy thì input sẽ  chạy
  if (audio.duration) {
    const progressPercent = Math.floor(
      (audio.currentTime / audio.duration) * 100
    );
    progress.value = progressPercent;
    start_Time.textContent = formatTime(audio.currentTime);
  }
};
audio.addEventListener("loadedmetadata", function () {
  var time = audio.duration;
  end_Time.textContent = formatTime(time);
});
function formatTime(time) {
  var minutes = Math.floor(time / 60);
  var seconds = Math.floor(time % 60);
  seconds = seconds < 10 ? "0" + seconds : seconds;
  return minutes + ":" + seconds;
}
document.onscroll = function () {
  // kéo danh sách lên
  const scrollTop = window.scrollY || document.documentElement.scrollTop;
  const newCdWidth = cdWidth - scrollTop;
  cd.style.width = newCdWidth > 0 ? newCdWidth + "px" : 0;
  cd.style.opacity = newCdWidth / cdWidth;
};

function appRun() {
  // func để chạy tt

  getCourses((db) => {
    // console.log(db);
    let data = db.songs;
    let count = 0;
    let lengthData = data.length;

    render(data); // lấy ra danh sách các bài hát và gắn vào HTML
    loadSong(data); // lấy ra bài hát muốn chạy

    nextBtn.onclick = function nextClick() {
      // chuyển bài tiếp
      if (count < lengthData - 1) {
        count++;
      } else {
        count = 0;
      }
      localStorage.setItem("count", count);
      loadSong(data);
      playSound();
      cdRun();
    };
    prevBtn.onclick = function () {
      // quay lại bài cũ
      if (count > 0) {
        count--;
      } else {
        count = lengthData - 1;
      }
      localStorage.setItem("count", count);
      loadSong(data);
      playSound();
      cdRun();
    };
    playlist.onclick = function (e) {
      // khi bấm vào danh sách songs
      const songNode = e.target.closest(".song:not(.active)"); // trả về 1 data-index và các tag div trong func render()
      if (songNode || e.target.closest(".option")) {
        if (songNode) {
          count = Number(songNode.dataset.index); // lấy index gán vào count
          //      console.log(songNode)
          //      console.log(count)
          localStorage.setItem("count", count);
          loadSong(data);
          playSound();
          cdRun();
        }
      }
    };
    let randomCount = Math.floor(Math.random() * lengthData);
    audio.addEventListener("ended", function () {
      // bắt sự kiện bài hát khi hết
      if (isRepeatBtn == true && isRandom == false) {
        // khi nút repeat bật random tắt
        audio.play();
      }
      if (isRandom === true && isRepeatBtn == false) {
        //  bật random tắt repeat

        localStorage.setItem("count", randomCount);
        loadSong(data);
        playSound();
        cdRun();
      } else {
        // bật hoặc tắt cả 2 lỗi  :)
        nextBtn.click();
      }
    });
  });
}

appRun(); // run
