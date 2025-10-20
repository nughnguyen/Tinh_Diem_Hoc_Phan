document.addEventListener('DOMContentLoaded', function () {
    // === KHAI BÁO BIẾN TOÀN CỤC ===
    const componentsContainer = document.getElementById('components-container');
    const addComponentBtn = document.getElementById('add-component-btn');
    const gradeForm = document.getElementById('grade-form');
    const resultDiv = document.getElementById('result');
    const currentTotalWeightEl = document.getElementById('current-total-weight');
    const alertBackdrop = document.getElementById('custom-alert-backdrop');
    const alertMessage = document.getElementById('custom-alert-message');
    const alertOkBtn = document.getElementById('custom-alert-ok-btn');
    const submitBtn = document.querySelector('#grade-form button[type="submit"]');
    const resetBtn = document.getElementById('reset-btn');

    // === CÁC HÀM XỬ LÝ LOGIC CHÍNH ===

    /**
     * HÀM MỚI: Kiểm tra lỗi cho một hàng cụ thể
     * Tách riêng logic để có thể gọi lại sau khi tải trang
     * @param {HTMLElement} row - Phần tử div.component-row cần kiểm tra
     */
    const validateRow = (row) => {
        if (!row) return;

        const scoreInput = row.querySelector('.component-score');
        const weightInput = row.querySelector('.component-weight');
        const errorMessageEl = row.querySelector('.error-message');
        let message = '';

        const weightValue = parseFloat(weightInput.value);
        if (weightValue > 100) message = 'Trọng số không thể lớn hơn 100%.';
        else if (weightValue < 0) message = 'Trọng số không thể là số âm.';

        const scoreValue = parseFloat(scoreInput.value);
        if (scoreValue > 100) message = 'Điểm không thể lớn hơn 100.';
        else if (scoreValue < 0) message = 'Điểm không thể là số âm.';

        errorMessageEl.textContent = message;
        errorMessageEl.classList.toggle('show', !!message); // !!message chuyển chuỗi thành boolean
    };

    // --- Hàm lưu dữ liệu vào Local Storage ---
    const saveDataToLocalStorage = () => {
        const rows = componentsContainer.querySelectorAll('.component-row');
        const dataToSave = [];
        rows.forEach(row => {
            const nameInput = row.querySelector('input[type="text"]');
            const weightInput = row.querySelector('.component-weight');
            const scoreInput = row.querySelector('.component-score');
            const finalCheckbox = row.querySelector('.component-final');

            dataToSave.push({
                name: nameInput.value,
                weight: weightInput.value,
                score: scoreInput.value,
                isFinal: finalCheckbox.checked
            });
        });
        localStorage.setItem('gradeCalculatorData', JSON.stringify(dataToSave));
    };

    // --- Hàm tạo một hàng điểm ---
    const createComponentRow = (name = '', weight = '', score = '', isFinal = false) => {
        const row = document.createElement('div');
        row.className = 'grid grid-cols-12 gap-2 md:gap-4 items-center component-row p-1.5 hover:bg-slate-50 dark:hover:bg-[rgb(30,45,65)] rounded-lg flex-wrap';
        row.innerHTML = `
            <div class="col-span-5">
                <input type="text" class="form-input w-full bg-slate-100 border-transparent rounded-md focus:ring-2 focus:ring-blue-500 focus:bg-white focus:border-blue-500 dark:bg-slate-700 dark:border-slate-600 dark:focus:bg-slate-600 dark:text-slate-100" placeholder="VD: Chuyên cần" value="${name}">
            </div>
            <div class="col-span-2">
                <input type="number" class="form-input component-weight w-full bg-slate-100 border-transparent rounded-md text-center focus:ring-2 focus:ring-blue-500 focus:bg-white focus:border-blue-500 dark:bg-slate-700 dark:border-slate-600 dark:focus:bg-slate-600 dark:text-slate-100" placeholder="%" min="0" max="100" step="1" value="${weight}">
            </div>
            <div class="col-span-2">
                <input type="number" class="form-input component-score w-full bg-slate-100 border-transparent rounded-md text-center focus:ring-2 focus:ring-blue-500 focus:bg-white focus:border-blue-500 dark:bg-slate-700 dark:border-slate-600 dark:focus:bg-slate-600 dark:text-slate-100" placeholder="Điểm" min="0" max="100" step="0.5" value="${score}">
            </div>
            <div class="col-span-2 flex justify-center">
                <label class="animated-checkbox-container">
                    <input type="checkbox" class="component-final" ${isFinal ? 'checked' : ''}>
                    <div class="checkmark"></div>
                </label>
            </div>
            <div class="col-span-1 flex justify-center">
                <button type="button" class="remove-btn text-slate-400 hover:text-red-500 transition-colors">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd" /></svg>
                </button>
            </div>
            <p class="error-message">Lỗi sẽ hiện ở đây</p>`;
        componentsContainer.appendChild(row);
    };

    // --- Hàm tạo các hàng mặc định ---
    const createDefaultRows = () => {
        createComponentRow('Điểm thành phần', '20', '', false);
        createComponentRow('Kiểm Tra Giữa Kỳ', '30', '', false);
        createComponentRow('Kiểm Tra Cuối Kỳ', '50', '', true);
    };

    // --- Hàm kiểm tra lỗi và bật/tắt nút ---
    const validateFormInputs = () => {
        const errors = componentsContainer.querySelectorAll('.error-message.show');
        submitBtn.disabled = errors.length > 0;
        submitBtn.classList.toggle('opacity-50', errors.length > 0);
        submitBtn.classList.toggle('cursor-not-allowed', errors.length > 0);
    };

    // --- Hàm tải dữ liệu từ Local Storage ---
    const loadDataFromLocalStorage = () => {
        const savedData = localStorage.getItem('gradeCalculatorData');
        componentsContainer.innerHTML = ''; // Xóa các hàng hiện có trước khi tải
        if (savedData) {
            const data = JSON.parse(savedData);
            if (data.length > 0) {
                data.forEach(item => {
                    createComponentRow(item.name, item.weight, item.score, item.isFinal);
                });
            } else {
                createDefaultRows(); // Nếu có lưu nhưng rỗng thì tạo mặc định
            }
        } else {
            createDefaultRows(); // Nếu không có gì được lưu thì tạo mặc định
        }

        // *** SỬA LỖI TẠI ĐÂY ***
        // Sau khi tạo tất cả các hàng, lặp qua và kiểm tra lỗi cho từng hàng
        const allRows = componentsContainer.querySelectorAll('.component-row');
        allRows.forEach(row => {
            validateRow(row);
        });

        updateTotalWeight();
        validateFormInputs(); // Cập nhật lại trạng thái nút Tính toán
    };

    // --- Hàm reset về trạng thái mặc định ---
    const resetToDefault = () => {
        localStorage.removeItem('gradeCalculatorData'); // Xóa dữ liệu đã lưu
        loadDataFromLocalStorage(); // Tải lại (sẽ ra mặc định)
        resultDiv.classList.add('hidden'); // Ẩn kết quả
    };

    // --- Hàm cập nhật tổng trọng số ---
    const updateTotalWeight = () => {
        let totalWeight = 0;
        const rows = componentsContainer.querySelectorAll('.component-row');
        rows.forEach(row => {
            const weightInput = row.querySelector('.component-weight');
            const weight = parseFloat(weightInput.value);
            if (!isNaN(weight) && weight > 0) {
                totalWeight += weight;
            }
        });
        currentTotalWeightEl.textContent = `${totalWeight}%`;
        currentTotalWeightEl.classList.remove('text-blue-600', 'text-green-600', 'text-red-600', 'dark:text-blue-400', 'dark:text-green-400', 'dark:text-red-400');
        
        if (totalWeight > 100) {
            currentTotalWeightEl.classList.add('text-red-600', 'dark:text-red-400');
        } else if (totalWeight === 100) {
            currentTotalWeightEl.classList.add('text-green-600', 'dark:text-green-400');
        } else {
            currentTotalWeightEl.classList.add('text-blue-600', 'dark:text-blue-400');
        }
    };
    
    // --- Các hàm cho hộp thoại thông báo ---
    function showCustomAlert(message) {
        alertMessage.textContent = message;
        alertBackdrop.classList.add('show');
    }
    function hideCustomAlert() {
        alertBackdrop.classList.remove('show');
    }

    // === GÁN CÁC SỰ KIỆN (EVENT LISTENERS) ===

    // --- Nút reset ---
    resetBtn.addEventListener('click', resetToDefault);

    // --- Nút thêm cột điểm ---
    addComponentBtn.addEventListener('click', () => {
        createComponentRow();
        saveDataToLocalStorage(); // Lưu lại sau khi thêm
    });

    // --- Các sự kiện trong container chứa các hàng ---
    componentsContainer.addEventListener('click', function (e) {
        if (e.target.closest('.remove-btn')) {
            e.target.closest('.component-row').remove();
            updateTotalWeight();
            validateFormInputs();
            saveDataToLocalStorage(); // Lưu lại sau khi xóa
        }
    });

    componentsContainer.addEventListener('change', function (e) {
        if (e.target.classList.contains('component-final')) {
            if (e.target.checked) {
                document.querySelectorAll('.component-final').forEach(checkbox => {
                    if (checkbox !== e.target) checkbox.checked = false;
                });
            }
            saveDataToLocalStorage(); // Lưu lại khi thay đổi checkbox
        }
    });

    componentsContainer.addEventListener('input', function (e) {
        const target = e.target;
        const row = target.closest('.component-row');
        
        validateRow(row); // Gọi hàm kiểm tra cho hàng hiện tại

        if (target.classList.contains('component-weight')) {
            updateTotalWeight();
        }
        
        validateFormInputs(); // Cập nhật trạng thái nút Tính toán
        saveDataToLocalStorage(); // Lưu lại mỗi khi người dùng nhập liệu
    });

    // --- Sự kiện submit form ---
    gradeForm.addEventListener('submit', function (event) {
        event.preventDefault();
        // ... (Toàn bộ logic tính toán giữ nguyên như cũ) ...
        let totalWeightedScore = 0;
        let totalWeight = 0;
        let finalExamScore = null;
        let hasInput = false;

        const rows = componentsContainer.querySelectorAll('.component-row');
        rows.forEach(row => {
            const weightInput = row.querySelector('.component-weight');
            const scoreInput = row.querySelector('.component-score');
            const weight = parseFloat(weightInput.value);
            const score = parseFloat(scoreInput.value);

            if (!isNaN(weight) && !isNaN(score) && weight > 0) {
                hasInput = true;
                totalWeight += weight;
                totalWeightedScore += score * (weight / 100);
                if (row.querySelector('.component-final').checked) {
                    finalExamScore = score;
                }
            }
        });

        if (!hasInput) {
            showCustomAlert('Vui lòng nhập ít nhất một cột điểm có trọng số và điểm số hợp lệ.');
            return;
        }

        if (totalWeight > 100) {
            showCustomAlert('Tổng trọng số đã vượt quá 100%. Vui lòng kiểm tra lại.');
            resultDiv.classList.add('hidden');
            return;
        }

        const finalScore = parseFloat(totalWeightedScore.toFixed(2));
        let letterGrade, classification, status, statusClass, score4, note = '';
        let isFailed = false;

        const noteEl = document.getElementById('note');
        noteEl.className = 'text-center font-medium mt-4 text-sm'; // Reset class
        if (totalWeight < 100) {
            note = `Lưu ý: Tổng trọng số hiện tại là ${totalWeight}%, không phải 100%.`;
            noteEl.classList.add('text-orange-600', 'dark:text-orange-400');
        }

        if (finalExamScore !== null && finalExamScore < 10.0) {
            isFailed = true;
            note += (note ? '<br>' : '') + 'Nợ môn do điểm thi kết thúc học phần dưới 10.0';
        }

        if (isFailed) {
            noteEl.classList.add('text-red-600', 'dark:text-red-400');
        }

        if (finalScore >= 85) { letterGrade = 'A'; score4 = 4.0; classification = 'Giỏi'; } 
        else if (finalScore >= 80) { letterGrade = 'A-'; score4 = 3.7; classification = 'Giỏi'; } 
        else if (finalScore >= 75) { letterGrade = 'B+'; score4 = 3.3; classification = 'Khá'; } 
        else if (finalScore >= 70) { letterGrade = 'B'; score4 = 3.0; classification = 'Khá'; } 
        else if (finalScore >= 65) { letterGrade = 'B-'; score4 = 2.7; classification = 'Khá'; } 
        else if (finalScore >= 60) { letterGrade = 'C+'; score4 = 2.3; classification = 'Trung bình'; } 
        else if (finalScore >= 55) { letterGrade = 'C'; score4 = 2.0; classification = 'Trung bình'; } 
        else if (finalScore >= 50) { letterGrade = 'C-'; score4 = 1.7; classification = 'Trung bình yếu'; } 
        else if (finalScore >= 45) { letterGrade = 'D+'; score4 = 1.3; classification = 'Trung bình yếu'; } 
        else if (finalScore >= 40) { letterGrade = 'D'; score4 = 1.0; classification = 'Trung bình yếu'; } 
        else { letterGrade = 'F'; score4 = 0.0; classification = 'Kém'; }

        if (isFailed || finalScore < 40.0) {
            letterGrade = 'F'; score4 = 0.0; classification = 'Kém';
            status = 'Nợ môn'; statusClass = 'bg-red-600 text-white';
        } else {
            status = 'Qua môn'; statusClass = 'bg-green-600 text-white';
        }

        document.getElementById('total-weight').textContent = `${totalWeight}%`;
        document.getElementById('final-score').textContent = finalScore.toFixed(2);
        document.getElementById('score-4').textContent = score4.toFixed(2);
        document.getElementById('letter-grade').textContent = letterGrade;
        document.getElementById('classification').textContent = classification;
        const statusEl = document.getElementById('status');
        statusEl.textContent = status;
        statusEl.className = `font-bold text-xl px-4 py-1.5 rounded-full ${statusClass}`;
        noteEl.innerHTML = note;
        resultDiv.classList.remove('hidden');
    });

    // --- Sự kiện cho hộp thoại thông báo ---
    alertOkBtn.addEventListener('click', hideCustomAlert);
    alertBackdrop.addEventListener('click', (e) => {
        if (e.target === alertBackdrop) hideCustomAlert();
    });

    // === KHỞI TẠO BAN ĐẦU ===
    loadDataFromLocalStorage();
});

// === LOGIC XỬ LÝ DARK MODE (GIỮ NGUYÊN) ===
document.addEventListener('DOMContentLoaded', function () {
    const themeToggle = document.getElementById('input');
    const applyInitialTheme = () => {
        if (localStorage.getItem('color-theme') === 'dark' || (!('color-theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
            document.documentElement.classList.add('dark');
            themeToggle.checked = true;
        } else {
            document.documentElement.classList.remove('dark');
            themeToggle.checked = false;
        }
    };
    themeToggle.addEventListener('change', function () {
        if (themeToggle.checked) {
            document.documentElement.classList.add('dark');
            localStorage.setItem('color-theme', 'dark');
        } else {
            document.documentElement.classList.remove('dark');
            localStorage.setItem('color-theme', 'light');
        }
    });
    applyInitialTheme();
});

// === LOGIC FIREBASE (GIỮ NGUYÊN) ===
document.addEventListener('DOMContentLoaded', function () {
    if (typeof firebase === 'undefined') {
        console.error("Firebase chưa được khởi tạo!");
        return;
    }
    const db = firebase.firestore();
    const realtimeDb = firebase.database();
    const totalVisitsEl = document.getElementById('total-visits');
    const concurrentUsersEl = document.getElementById('concurrent-users');
    const counterDocRef = db.collection('siteStats').doc('visits');

    counterDocRef.get().then((doc) => {
        if (sessionStorage.getItem('visitCounted')) return; // Chỉ đếm 1 lần mỗi session
        sessionStorage.setItem('visitCounted', 'true');
        
        let newCount = 1;
        if (doc.exists && doc.data().count) {
            newCount = doc.data().count + 1;
        }
        counterDocRef.set({ count: newCount }, { merge: true });
    }).catch(err => {
        console.error("Lỗi khi cập nhật lượt truy cập: ", err);
        totalVisitsEl.textContent = "N/A";
    });

    counterDocRef.onSnapshot((doc) => {
        if (doc.exists) {
            totalVisitsEl.textContent = doc.data().count.toLocaleString('vi-VN');
        }
    });

    const presenceRef = realtimeDb.ref('/onlineUsers');
    const myPresenceRef = presenceRef.push();
    realtimeDb.ref('.info/connected').on('value', (snapshot) => {
        if (snapshot.val() === true) {
            myPresenceRef.set(true);
            myPresenceRef.onDisconnect().remove();
        }
    });
    presenceRef.on('value', (snapshot) => {
        concurrentUsersEl.textContent = snapshot.numChildren().toLocaleString('vi-VN');
    });
});