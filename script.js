document.addEventListener('DOMContentLoaded', function() {
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

    const createComponentRow = (name = '', weight = '', score = '', isFinal = false) => {
        const row = document.createElement('div');
        row.className = 'grid grid-cols-12 gap-2 md:gap-4 items-center component-row p-1.5 hover:bg-slate-50 dark:hover:bg-slate-700/50 rounded-lg';
        
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

    componentsContainer.addEventListener('click', function(e) {
        if (e.target.closest('.remove-btn')) {
            e.target.closest('.component-row').remove();
            updateTotalWeight();
        }
    });

    componentsContainer.addEventListener('change', function(e) {
        if (e.target.classList.contains('component-final')) {
            if (e.target.checked) {
                document.querySelectorAll('.component-final').forEach(checkbox => {
                    if (checkbox !== e.target) checkbox.checked = false;
                });
            }
        }
    });

    componentsContainer.addEventListener('input', function(e) {
        if (e.target.classList.contains('component-score')) {
            if (parseFloat(e.target.value) > 100) {
                alert('Điểm không hợp lệ. Vui lòng chỉ nhập điểm trong thang điểm 100.');
                e.target.value = '';
            }
        }
        if (e.target.classList.contains('component-weight')) {
            updateTotalWeight();
        }
    });

    gradeForm.addEventListener('submit', function(event) {
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
            alert('Vui lòng nhập ít nhất một cột điểm có trọng số và điểm số hợp lệ.');
            return;
        }

        if (totalWeight > 100) {
            alert('Tổng trọng số đã vượt quá 100%. Vui lòng kiểm tra lại.');
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
            statusClass = 'bg-red-100 text-red-700';
        } else {
            status = 'Qua môn';
            statusClass = 'bg-green-100 text-green-700';
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
document.addEventListener('DOMContentLoaded', function() {
    const themeToggle = document.getElementById('input');

    // Hàm kiểm tra và đặt trạng thái ban đầu cho công tắc
    const applyInitialTheme = () => {
        const isDarkMode = localStorage.getItem('color-theme') === 'dark' || 
                           (!('color-theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches);
        
        if (isDarkMode) {
            document.documentElement.classList.add('dark');
            themeToggle.checked = true;
        } else {
            document.documentElement.classList.remove('dark');
            themeToggle.checked = false;
        }
    };

    // Lắng nghe sự kiện thay đổi trên công tắc
    themeToggle.addEventListener('change', function() {
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
