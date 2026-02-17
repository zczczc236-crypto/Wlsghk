let state = {
    exp: 0,
    level: 1,
    coins: 0,
    autoGrowthRate: 0,
    nextLevelExp: 100
};

const petIcons = ["🌱", "🌿", "🌷", "🌻", "🌳", "🐉", "🔥"];
const petNames = ["새싹", "풀떼기", "튤립", "해바라기", "거대 나무", "아기 드래곤", "불의 신"];

// 초기 데이터 불러오기
window.onload = () => {
    const saved = localStorage.getItem('petGameSave');
    if (saved) {
        state = JSON.parse(saved);
        updateUI();
    }
    // 자동 성장 타이머
    setInterval(() => {
        if (state.autoGrowthRate > 0) {
            addExp(state.autoGrowthRate);
        }
    }, 1000);
};

function handleTouch() {
    addExp(5 + state.level); // 클릭당 경험치
    state.coins += 1;
    document.getElementById('sfx-pop').cloneNode(true).play();
    updateUI();
}

function addExp(amount) {
    state.exp += amount;
    if (state.exp >= state.nextLevelExp) {
        levelUp();
    }
    saveGame();
    updateUI();
}

function levelUp() {
    state.level++;
    state.exp = 0;
    state.nextLevelExp = Math.floor(state.nextLevelExp * 1.5);
    state.coins += state.level * 50;
    
    document.getElementById('sfx-level').play();
    const petEl = document.getElementById('pet');
    petEl.classList.add('level-up-anim');
    setTimeout(() => petEl.classList.remove('level-up-anim'), 500);
}

function buyUpgrade() {
    let cost = 50 + (state.autoGrowthRate * 20);
    if (state.coins >= cost) {
        state.coins -= cost;
        state.autoGrowthRate += 2;
        updateUI();
    } else {
        alert("코인이 부족해요!");
    }
}

function updateUI() {
    // 경험치 바 및 텍스트
    const percent = Math.min((state.exp / state.nextLevelExp) * 100, 100);
    document.getElementById('exp-bar').style.width = percent + '%';
    document.getElementById('exp-percent').innerText = Math.floor(percent);
    
    // 레벨 및 아이콘
    document.getElementById('level-display').innerText = state.level;
    const iconIdx = Math.min(Math.floor((state.level - 1) / 2), petIcons.length - 1);
    document.getElementById('pet').innerText = petIcons[iconIdx];
    document.getElementById('pet-name').innerText = petNames[iconIdx];
    
    // 기타 스탯
    document.getElementById('coins').innerText = state.coins;
    document.getElementById('aps').innerText = state.autoGrowthRate;
    document.getElementById('upgrade-btn').innerText = `자동 성장 물약 (비용: ${50 + (state.autoGrowthRate * 20)}코인)`;
}

function saveGame() {
    localStorage.setItem('petGameSave', JSON.stringify(state));
}

function toggleMusic() {
    const bgm = document.getElementById('bgm');
    bgm.paused ? bgm.play() : bgm.pause();
}
