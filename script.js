document.addEventListener('DOMContentLoaded', function () {
    // === LOGIC CHO HỘP THOẠI TÙY CHỈNH NÂNG CẤP ===
    const alertBackdrop = document.getElementById('custom-alert-backdrop');
    const alertBox = document.getElementById('custom-alert-box');
    const alertMessage = document.getElementById('custom-alert-message');
    const alertOkBtn = document.getElementById('custom-alert-ok-btn');
    const submitBtn = document.querySelector('#grade-form button[type="submit"]');

    function showCustomAlert(message) {
        alertMessage.textContent = message;
        alertBackdrop.classList.add('show');
    }

    function hideCustomAlert() {
        alertBackdrop.classList.remove('show');
    }

    alertOkBtn.addEventListener('click', hideCustomAlert);

    alertBackdrop.addEventListener('click', (e) => {
        if (e.target === alertBackdrop) {
            hideCustomAlert();
        }
    });
    // ===============================================
    const componentsContainer = document.getElementById('components-container');
    const addComponentBtn = document.getElementById('add-component-btn');
    const gradeForm = document.getElementById('grade-form');
    const resultDiv = document.getElementById('result');
    const currentTotalWeightEl = document.getElementById('current-total-weight');

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

        currentTotalWeightEl.classList.remove('text-blue-600', 'text-green-600', 'text-red-600');
        if (totalWeight > 100) {
            currentTotalWeightEl.classList.add('text-red-600');
        } else if (totalWeight === 100) {
            currentTotalWeightEl.classList.add('text-green-600');
        } else {
            currentTotalWeightEl.classList.add('text-blue-600');
        }
    };

    // HÀM MỚI: Kiểm tra tất cả lỗi và bật/tắt nút Tính toán
    const validateFormInputs = () => {
        const errors = componentsContainer.querySelectorAll('.error-message.show');
        if (errors.length > 0) {
            submitBtn.disabled = true;
            submitBtn.classList.add('opacity-50', 'cursor-not-allowed');
        } else {
            submitBtn.disabled = false;
            submitBtn.classList.remove('opacity-50', 'cursor-not-allowed');
        }
    };

    const createComponentRow = (name = '', weight = '', score = '', isFinal = false) => {
        const row = document.createElement('div');
        // SỬA Ở ĐÂY: Thêm class 'flex-wrap' để thông báo lỗi xuống dòng
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
        <p class="error-message">Lỗi sẽ hiện ở đây</p>
    `;
        componentsContainer.appendChild(row);
    };

    createComponentRow('Điểm thành phần', '20', '', false);
    createComponentRow('Kiểm Tra Giữa Kỳ', '30', '', false);
    createComponentRow('Kiểm Tra Cuối Kỳ', '50', '', true);
    updateTotalWeight();

    addComponentBtn.addEventListener('click', () => {
        createComponentRow();
        updateTotalWeight();
    });

    componentsContainer.addEventListener('click', function (e) {
        if (e.target.closest('.remove-btn')) {
            e.target.closest('.component-row').remove();
            updateTotalWeight();
        }
    });

    componentsContainer.addEventListener('change', function (e) {
        if (e.target.classList.contains('component-final')) {
            if (e.target.checked) {
                document.querySelectorAll('.component-final').forEach(checkbox => {
                    if (checkbox !== e.target) checkbox.checked = false;
                });
            }
        }
    });


    componentsContainer.addEventListener('input', function (e) {
        const target = e.target; // Ô input cụ thể vừa được thay đổi
        const row = target.closest('.component-row');
        if (!row) return;

        // Lấy tất cả các phần tử liên quan trong hàng
        const scoreInput = row.querySelector('.component-score');
        const weightInput = row.querySelector('.component-weight');
        const errorMessageEl = row.querySelector('.error-message');

        let message = ''; // Bắt đầu với trạng thái không có lỗi

        // --- Logic mới: Kiểm tra lại CẢ HAI ô input mỗi lần có thay đổi ---

        // 1. Kiểm tra lỗi của ô Trọng số trước
        const weightValue = parseFloat(weightInput.value);
        if (weightValue > 100) {
            message = 'Trọng số không thể lớn hơn 100%.';
        } else if (weightValue < 0) {
            message = 'Trọng số không thể là số âm.';
        }

        // 2. Kiểm tra lỗi của ô Điểm (lỗi này sẽ được ưu tiên hiển thị nếu cả 2 cùng sai)
        const scoreValue = parseFloat(scoreInput.value);
        if (scoreValue > 100) {
            message = 'Điểm không thể lớn hơn 100.';
        } else if (scoreValue < 0) {
            message = 'Điểm không thể là số âm.';
        }

        // 3. Cập nhật giao diện dựa trên kết quả kiểm tra cuối cùng
        if (message) {
            // Nếu có bất kỳ lỗi nào, hiển thị nó
            errorMessageEl.textContent = message;
            errorMessageEl.classList.add('show');
        } else {
            // Chỉ ẩn thông báo khi CẢ HAI ô đều hợp lệ
            errorMessageEl.classList.remove('show');
        }

        // --- Các hành động phụ ---

        // Nếu người dùng thay đổi trọng số, thì cập nhật tổng
        if (target.classList.contains('component-weight')) {
            updateTotalWeight();
        }

        // Luôn luôn kiểm tra lại toàn bộ form để bật/tắt nút "Tính toán"
        validateFormInputs();
    });

    gradeForm.addEventListener('submit', function (event) {
        event.preventDefault();

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
        if (totalWeight < 100) {
            note = `Lưu ý: Tổng trọng số hiện tại là ${totalWeight}%, không phải 100%.`;
            noteEl.className = 'text-center font-medium mt-4 text-sm text-orange-600';
        } else {
            note = '';
            noteEl.className = 'text-center font-medium mt-4 text-sm';
        }

        if (finalExamScore !== null && finalExamScore < 10.0) {
            isFailed = true;
            note += (note ? '<br>' : '') + 'Nợ môn do điểm thi kết thúc học phần dưới 10.0';
        } else if (finalScore < 40.0) {
            isFailed = true;
            note += (note ? '<br>' : '') + 'Nợ môn do điểm tổng kết học phần dưới 40.0';
        }

        if (isFailed) {
            noteEl.classList.add('text-red-600');
        }

        if (finalScore >= 95) { letterGrade = 'A+'; score4 = 4.0; classification = 'Giỏi'; }
        else if (finalScore >= 85) { letterGrade = 'A'; score4 = 4.0; classification = 'Giỏi'; }
        else if (finalScore >= 80) { letterGrade = 'A-'; score4 = 3.65; classification = 'Giỏi'; }
        else if (finalScore >= 75) { letterGrade = 'B+'; score4 = 3.33; classification = 'Khá'; }
        else if (finalScore >= 70) { letterGrade = 'B'; score4 = 3.0; classification = 'Khá'; }
        else if (finalScore >= 65) { letterGrade = 'B-'; score4 = 2.65; classification = 'Khá'; }
        else if (finalScore >= 60) { letterGrade = 'C+'; score4 = 2.33; classification = 'Trung bình'; }
        else if (finalScore >= 55) { letterGrade = 'C'; score4 = 2.0; classification = 'Trung bình'; }
        else if (finalScore >= 45) { letterGrade = 'C-'; score4 = 1.65; classification = 'Trung bình yếu'; }
        else if (finalScore >= 40) { letterGrade = 'D'; score4 = 1.0; classification = 'Trung bình yếu'; }
        else { letterGrade = 'F'; score4 = 0.0; classification = 'Kém'; }

        if (isFailed) {
            letterGrade = 'F';
            score4 = 0.0;
            classification = 'Kém';
            status = 'Nợ môn';
            statusClass = 'bg-red-600 text-white';
        } else {
            status = 'Qua môn';
            statusClass = 'bg-green-600 text-white';
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
});
// === LOGIC XỬ LÝ DARK MODE MỚI ===
document.addEventListener('DOMContentLoaded', function () {
    const themeToggle = document.getElementById('input');

    // Hàm kiểm tra và đặt trạng thái ban đầu cho công tắc
const applyInitialTheme = () => {
    if (localStorage.getItem('color-theme') === 'dark' || (!('color-theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
        document.documentElement.classList.add('dark');
        themeToggle.checked = true;
    } else {
        document.documentElement.classList.remove('dark');
        themeToggle.checked = false;
    }
};

    // Lắng nghe sự kiện thay đổi trên công tắc
    themeToggle.addEventListener('change', function () {
        if (themeToggle.checked) {
            document.documentElement.classList.add('dark');
            localStorage.setItem('color-theme', 'dark');
        } else {
            document.documentElement.classList.remove('dark');
            localStorage.setItem('color-theme', 'light');
        }
    });

    // Áp dụng theme khi trang được tải lần đầu
    applyInitialTheme();
});
