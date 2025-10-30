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
    // === BIẾN MỚI CHO BỘ CHỌN TRƯỜNG ===
    const schoolSelectorBtn = document.getElementById('school-selector-btn');
    const schoolDropdown = document.getElementById('school-dropdown');
    const schoolSearchInput = document.getElementById('school-search-input');
    const schoolList = document.getElementById('school-list');
    const mainPageTitle = document.getElementById('main-page-title');
    const currentSchoolNameBtn = document.getElementById('current-school-name-btn');
    const schoolAaoLink = document.getElementById('school-aao-link');
    const pageTitle = document.querySelector('title'); // Lấy thẻ <title>

// === DỮ LIỆU CÁC TRƯỜNG ĐẠI HỌC ===
const universities = {
    'eiu': {
        name: 'ĐH Quốc Tế Miền Đông (EIU)',
        shortName: 'EIU',
        aaoUrl: 'https://aao.eiu.edu.vn/#/home',
        aaoText: "EIU's Portal",
        scale: 100 // Thang điểm 100
    },
    'uit': {
        name: 'ĐH Công Nghệ Thông Tin (UIT-VNU)',
        shortName: 'UIT',
        aaoUrl: 'https://daa.uit.edu.vn/',
        aaoText: "UIT's Portal",
        scale: 10 // Thang điểm 10
    },
    'bdu': {
        name: 'ĐH Bình Dương (BDU)',
        shortName: 'BDU',
        aaoUrl: 'https://sv.bdu.edu.vn/#/home',
        aaoText: "BDU's Portal",
        scale: 100 // Thang điểm 100
    },
    // Thêm các trường khác ở đây với key duy nhất
    'hcmut': {
        name: 'ĐH Bách Khoa (HCMUT)',
        shortName: 'HCMUT',
        aaoUrl: 'https://aao.hcmut.edu.vn/',
        aaoText: "HCMUT's Portal",
        scale: 10 // Giả sử thang điểm 10
    },
    'huflit': {
        name: 'ĐH Ngoại Ngữ - Tin Học TP.HCM (HUFLIT)',
        shortName: 'HUFLIT',
        aaoUrl: 'https://portal.huflit.edu.vn/',
        aaoText: "HUFLIT's Portal",
        scale: 10 // Thang điểm 10
    }
};

    
    // Biến toàn cục để lưu trường đang chọn
    let currentUniversityKey = 'eiu'; // Mặc định là EIU

    // === CÁC HÀM XỬ LÝ LOGIC CHÍNH ===

/**
     * HÀM MỚI: Kiểm tra lỗi cho một hàng cụ thể
     * Tách riêng logic để có thể gọi lại sau khi tải trang
     * @param {HTMLElement} row - Phần tử div.component-row cần kiểm tra
     */
    const validateRow = (row) => {
        if (!row) return;

        // *** LOGIC MỚI: Lấy thang điểm của trường hiện tại ***
        const scale = (universities[currentUniversityKey] && universities[currentUniversityKey].scale) ? universities[currentUniversityKey].scale : 100;

        const scoreInput = row.querySelector('.component-score');
        const weightInput = row.querySelector('.component-weight');
        const errorMessageEl = row.querySelector('.error-message');
        let message = '';

        const weightValue = parseFloat(weightInput.value);
        const scoreValue = parseFloat(scoreInput.value);

        // --- Kiểm tra lỗi theo thứ tự ưu tiên ---

        // 1. Kiểm tra Trọng số
        if (weightValue > 100) {
            message = 'Trọng số không thể lớn hơn 100%.';
        } else if (weightValue < 0) {
            message = 'Trọng số không thể là số âm.';
        
        // 2. Kiểm tra Điểm (số âm)
        } else if (scoreValue < 0) { 
            message = 'Điểm không thể là số âm.';
        
        // 3. Kiểm tra Điểm (vượt thang điểm)
        } else if (scale === 10 && scoreValue > 10) {
            message = 'Điểm không thể lớn hơn 10 (thang 10).';
        } else if (scale === 100 && scoreValue > 100) { // (Giữ lại logic cho thang 100)
            message = 'Điểm không thể lớn hơn 100 (thang 100).';
        }

        // Hiển thị hoặc ẩn thông báo lỗi
        errorMessageEl.textContent = message;
        errorMessageEl.classList.toggle('show', !!message); // !!message chuyển chuỗi thành boolean
    };
    
    // === CÁC HÀM MỚI CHO BỘ CHỌN TRƯỜNG ===

    /**
     * HÀM MỚI: Cập nhật UI theo trường đã chọn
     * @param {string} key - Key của trường (ví dụ: 'eiu')
     */
    const setUniversity = (key) => {
    if (!universities[key]) key = 'eiu'; // An toàn, quay về mặc định nếu key sai

    // Lấy thang điểm cũ TRƯỚC khi thay đổi
    const oldScale = (universities[currentUniversityKey] && universities[currentUniversityKey].scale) ? universities[currentUniversityKey].scale : 100;

    currentUniversityKey = key;
    const uni = universities[key];
    const newScale = uni.scale;

    // Cập nhật UI
    mainPageTitle.textContent = `Công cụ tính điểm ${uni.shortName}`;
    currentSchoolNameBtn.textContent = uni.shortName;
    schoolAaoLink.href = uni.aaoUrl;
    schoolAaoLink.textContent = uni.aaoText;
    pageTitle.textContent = `Công cụ tính điểm | ${uni.shortName}`; // Cập nhật title của tab

    // Lưu lựa chọn vào Local Storage
    localStorage.setItem('selectedUniversity', key);

    // Cập nhật lại danh sách để highlight mục đã chọn
    populateSchoolList(schoolSearchInput.value); // Giữ nguyên filter

    // Ẩn dropdown
    schoolDropdown.classList.add('hidden');

    // Reset kết quả cũ
    resultDiv.classList.add('hidden');

    // *** LOGIC MỚI: Đổi thang điểm ***
    if (oldScale !== newScale) {
        // *** SỬA ĐỔI: Truyền cả thang điểm cũ và mới ***
        convertExistingInputFields(oldScale, newScale);
    }
};

    /**
     * HÀM MỚI: Hiển thị danh sách trường (có lọc)
     * @param {string} filter - Chuỗi tìm kiếm
     */
    const populateSchoolList = (filter = '') => {
        schoolList.innerHTML = ''; // Xóa list cũ
        const filterLower = filter.toLowerCase().trim();
        let hasResults = false;

        Object.keys(universities).forEach(key => {
            const uni = universities[key];
            if (uni.name.toLowerCase().includes(filterLower) || uni.shortName.toLowerCase().includes(filterLower)) {
                hasResults = true;
                const li = document.createElement('li');
                const button = document.createElement('button');
                button.type = 'button';
                button.textContent = uni.name;
                button.dataset.key = key; // Lưu key vào data-attribute
                
                if (key === currentUniversityKey) {
                    button.classList.add('selected'); // Thêm class 'selected' nếu là trường hiện tại
                }

                button.addEventListener('click', () => {
                    setUniversity(key);
                });

                li.appendChild(button);
                schoolList.appendChild(li);
            }
        });

        if (!hasResults) {
            schoolList.innerHTML = `<li><span class="no-result">Không tìm thấy trường...</span></li>`;
        }
    };

    /**
     * HÀM MỚI: Tải trường đã lưu từ Local Storage
     * Sửa lỗi F5 làm mất dữ liệu
     */
    const loadSavedUniversity = () => {
        const savedKey = localStorage.getItem('selectedUniversity');
        
        // 1. Chỉ CẬP NHẬT BIẾN TOÀN CỤC, không gọi setUniversity()
        // Điều này đảm bảo thang điểm được đặt đúng trước khi tải dữ liệu
        if (savedKey && universities[savedKey]) {
            currentUniversityKey = savedKey;
        } else {
            currentUniversityKey = 'eiu'; // Mặc định là EIU
        }

        // 2. Cập nhật UI tĩnh (tiêu đề, link, v.v.) dựa trên biến đã tải
        const uni = universities[currentUniversityKey];
        mainPageTitle.textContent = `Công cụ tính điểm ${uni.shortName}`;
        currentSchoolNameBtn.textContent = uni.shortName;
        schoolAaoLink.href = uni.aaoUrl;
        schoolAaoLink.textContent = uni.aaoText;
        pageTitle.textContent = `Công cụ tính điểm | ${uni.shortName}`;

        // 3. Tải danh sách (để highlight đúng mục đã chọn)
        populateSchoolList();
    };

    /**
     * HÀM MỚI (ĐÃ SỬA): Cập nhật các trường input hiện có khi đổi thang điểm
     * @param {number} oldScale - Thang điểm cũ (10 hoặc 100)
     * @param {number} newScale - Thang điểm mới (10 hoặc 100)
     */
    const convertExistingInputFields = (oldScale, newScale) => {
        const scoreTooltip = document.getElementById('score-tooltip-content');
        const scoreInputs = componentsContainer.querySelectorAll('.component-score');
        
        if (newScale === 10) {
            // --- Chuyển sang Thang 10 ---
            if (scoreTooltip) {
                scoreTooltip.innerHTML = 'Vui lòng nhập điểm theo <strong class="text-yellow-300">thang điểm 10</strong>. Ví dụ: 8.5, 7.8...';
            }
            scoreInputs.forEach(input => {
                input.max = 10;
                input.step = 0.1;
                input.placeholder = "Hệ 10";
                
                // *** LOGIC CHUYỂN ĐỔI (KHÔNG XÓA) ***
                const currentValue = parseFloat(input.value);
                if (!isNaN(currentValue) && oldScale === 100) {
                    // Chuyển 85.5 -> 8.55
                    input.value = currentValue / 10;
                }
            });

        } else { // Mặc định là thang 100
            // --- Chuyển sang Thang 100 ---
            if (scoreTooltip) {
                scoreTooltip.innerHTML = 'Vui lòng nhập điểm theo <strong class="text-yellow-300">thang điểm 100</strong>. Ví dụ: 85, 78...';
            }
            scoreInputs.forEach(input => {
                input.max = 100;
                input.step = 0.5;
                input.placeholder = "Điểm";

                // *** LOGIC CHUYỂN ĐỔI (KHÔNG XÓA) ***
                const currentValue = parseFloat(input.value);
                if (!isNaN(currentValue) && oldScale === 10) {
                    // Chuyển 8.5 -> 85
                    // Chuyển 8.55 -> 85.5
                    input.value = currentValue * 10;
                }
            });
        }

        // Xác thực lại các hàng (để xóa/hiện thông báo lỗi nếu cần)
        const allRows = componentsContainer.querySelectorAll('.component-row');
        allRows.forEach(row => validateRow(row));
        validateFormInputs(); // Cập nhật lại trạng thái nút
        saveDataToLocalStorage(); // Lưu trạng thái ĐÃ CHUYỂN ĐỔI
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
    // *** LOGIC MỚI: Lấy thang điểm hiện tại ***
    const scale = (universities[currentUniversityKey] && universities[currentUniversityKey].scale) ? universities[currentUniversityKey].scale : 100;
    const max = scale === 10 ? 10 : 100;
    const step = scale === 10 ? 0.1 : 0.5;
    const placeholder = scale === 10 ? "Hệ 10" : "Điểm";

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
            <input type="number" class="form-input component-score w-full bg-slate-100 border-transparent rounded-md text-center focus:ring-2 focus:ring-blue-500 focus:bg-white focus:border-blue-500 dark:bg-slate-700 dark:border-slate-600 dark:focus:bg-slate-600 dark:text-slate-100" 
                   placeholder="${placeholder}" min="0" max="${max}" step="${step}" value="${score}">
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
        loadSavedUniversity(); // Tải trường ĐH đã lưu (hàm này sẽ tự gọi populateSchoolList)
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
    // --- SỰ KIỆN MỚI CHO BỘ CHỌN TRƯỜNG ---
    schoolSelectorBtn.addEventListener('click', (e) => {
        e.stopPropagation(); // Ngăn sự kiện click lan ra document
        schoolDropdown.classList.toggle('hidden');
        if (!schoolDropdown.classList.contains('hidden')) {
            // Tải lại danh sách khi mở (để xóa filter cũ)
            populateSchoolList(); 
            schoolSearchInput.value = ''; // Xóa nội dung tìm kiếm cũ
            schoolSearchInput.focus();
        }
    });

    schoolSearchInput.addEventListener('input', () => {
        populateSchoolList(schoolSearchInput.value);
    });

    // Ngăn việc click vào input tìm kiếm làm đóng dropdown
    schoolSearchInput.addEventListener('click', (e) => {
        e.stopPropagation();
    });

    // Đóng dropdown khi click ra ngoài
    document.addEventListener('click', (e) => {
        if (!schoolDropdown.classList.contains('hidden')) {
            schoolDropdown.classList.add('hidden');
        }
    });

// --- Sự kiện submit form ---
gradeForm.addEventListener('submit', function (event) {
    event.preventDefault();

    let totalWeightedScore = 0;
    let totalWeight = 0;
    let finalExamScore = null;
    let hasInput = false;

    // Lấy thang điểm của trường hiện tại
    const scale = (universities[currentUniversityKey] && universities[currentUniversityKey].scale) ? universities[currentUniversityKey].scale : 100;

    const rows = componentsContainer.querySelectorAll('.component-row');
    rows.forEach(row => {
        const weightInput = row.querySelector('.component-weight');
        const scoreInput = row.querySelector('.component-score');
        const weight = parseFloat(weightInput.value);
        const score = parseFloat(scoreInput.value); // Đây là điểm thô (hệ 10 hoặc 100)

        // *** LOGIC MỚI: Chuẩn hóa điểm về thang 100 ***
        let normalizedScore = score;
        if (scale === 10) {
            normalizedScore = score * 10; // Chuyển 8.5 -> 85
        }

        // Dùng normalizedScore để tính toán
        if (!isNaN(weight) && !isNaN(score) && weight > 0) { // Vẫn kiểm tra `score` gốc
            hasInput = true;
            totalWeight += weight;
            totalWeightedScore += normalizedScore * (weight / 100);
            if (row.querySelector('.component-final').checked) {
                finalExamScore = normalizedScore; // finalExamScore giờ luôn là hệ 100
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
    // === CÁC HÀM TÍNH TOÁN RIÊNG BIỆT ===

/**
 * HÀM TÍNH TOÁN: Quy chế của EIU (Hệ 100)
 * @param {object} inputs - { totalWeightedScore, finalExamScore, totalWeight }
 * @returns {object} - { finalScore, letterGrade, ... }
 */
const calculateGrade_EIU = (inputs) => {
    // totalWeightedScore và finalExamScore đã được chuẩn hóa hệ 100
    const { totalWeightedScore, finalExamScore, totalWeight } = inputs;

    // EIU dùng hệ 100
    const finalScore = parseFloat(totalWeightedScore.toFixed(2));
    let letterGrade, classification, status, statusClass, score4, note = '';
    let isFailed = false;

    if (totalWeight < 100) {
        note = `Lưu ý: Tổng trọng số hiện tại là ${totalWeight}%, không phải 100%.`;
    }

    // Quy chế điểm liệt của EIU: Điểm cuối kỳ (hệ 100) < 10.0
    // finalExamScore đã là hệ 100, nên logic này vẫn ĐÚNG
    if (finalExamScore !== null && finalExamScore < 10.0) {
        isFailed = true;
        note += (note ? '<br>' : '') + 'Nợ môn do điểm thi kết thúc học phần dưới 10.0';
    }

    // Thang điểm EIU
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

    // Trả về điểm hệ 100
    return { finalScore, letterGrade, score4, classification, status, statusClass, note, isFailed };
};

/**
 * HÀM TÍNH TOÁN: Quy chế của UIT (Ví dụ - Hệ 10)
 * @param {object} inputs - { totalWeightedScore, finalExamScore, totalWeight }
 * @returns {object} - { finalScore, letterGrade, ... }
 */
const calculateGrade_UIT = (inputs) => {
    // totalWeightedScore và finalExamScore đã được chuẩn hóa hệ 100
    const { totalWeightedScore, finalExamScore, totalWeight } = inputs;

    // UIT dùng thang 10, nên ta chia 10
    // (totalWeightedScore vẫn là điểm hệ 100, ví dụ: 85)
    const finalScore10 = parseFloat(totalWeightedScore.toFixed(2)) / 10;

    let letterGrade, classification, status, statusClass, score4, note = '';
    let isFailed = false;

    if (totalWeight < 100) {
        note = `Lưu ý: Tổng trọng số hiện tại là ${totalWeight}%, không phải 100%.`;
    }

    // Quy chế điểm liệt của UIT (ví dụ: điểm cuối kỳ < 3.0 hệ 10)
    // finalExamScore (hệ 100) < 30.0. Logic này vẫn ĐÚNG.
    if (finalExamScore !== null && finalExamScore < 30.0) { 
        isFailed = true;
        note += (note ? '<br>' : '') + 'Nợ môn do điểm thi cuối kỳ dưới 3.0 (hệ 10)';
    }

    // Thang điểm 10 của UIT (ví dụ)
    if (finalScore10 >= 8.5) { letterGrade = 'A'; score4 = 4.0; classification = 'Giỏi'; }
    else if (finalScore10 >= 8.0) { letterGrade = 'A-'; score4 = 3.7; classification = 'Giỏi'; } // UIT có thể không có A-
    else if (finalScore10 >= 7.0) { letterGrade = 'B+'; score4 = 3.3; classification = 'Khá'; }
    else if (finalScore10 >= 6.5) { letterGrade = 'B'; score4 = 3.0; classification = 'Khá'; }
    else if (finalScore10 >= 5.5) { letterGrade = 'C+'; score4 = 2.3; classification = 'Trung bình'; }
    else if (finalScore10 >= 5.0) { letterGrade = 'C'; score4 = 2.0; classification = 'Trung bình'; }
    else if (finalScore10 >= 4.0) { letterGrade = 'D'; score4 = 1.0; classification = 'Trung bình yếu'; }
    else { letterGrade = 'F'; score4 = 0.0; classification = 'Kém'; }

    if (isFailed || finalScore10 < 4.0) {
        letterGrade = 'F'; score4 = 0.0; classification = 'Kém';
        status = 'Nợ môn'; statusClass = 'bg-red-600 text-white';
    } else {
        status = 'Qua môn'; statusClass = 'bg-green-600 text-white';
    }

    note += (note ? '<br>' : '') + 'Kết quả được tính theo thang điểm 10 (UIT).';

    // Trả về điểm hệ 10
    return { finalScore: finalScore10, // Hiển thị điểm hệ 10
             letterGrade, score4, classification, status, statusClass, note, isFailed };
};

/**
 * HÀM TÍNH TOÁN: Quy chế của BDU (Ví dụ)
 * @param {object} inputs - { totalWeightedScore, finalExamScore, totalWeight }
 * @returns {object} - { finalScore, letterGrade, ... }
 */
const calculateGrade_BDU = (inputs) => {
     // Giả sử BDU giống hệt EIU cho mục đích demo
     // Bạn có thể sao chép và chỉnh sửa thang điểm của BDU tại đây
     let result = calculateGrade_EIU(inputs);
     result.note = 'Áp dụng quy chế tính điểm BDU (Demo).' + (result.note ? `<br>${result.note}` : '');
     return result;
};


/**
 * HÀM TÍNH TOÁN: Quy chế của HUFLIT (ĐH Ngoại Ngữ - Tin Học TP.HCM)
 * Dựa trên các hình ảnh được cung cấp (huflit1.jpg, huflit2.jpg, huflit3.jpg)
 * @param {object} inputs - { totalWeightedScore, finalExamScore, totalWeight }
 * @returns {object} - { finalScore, letterGrade, ... }
 */
const calculateGrade_HUFLIT = (inputs) => {
    // totalWeightedScore đã được chuẩn hóa hệ 100
    const { totalWeightedScore, totalWeight } = inputs;

    // HUFLIT dùng thang điểm 10.
    // huflit1.jpg: "điểm tổng kết học phần được làm tròn đến 0.1"
    const finalScore10_raw = totalWeightedScore / 10; // totalWeightedScore là hệ 100
    const finalScore10 = Math.round(finalScore10_raw * 10) / 10;

    let letterGrade, classification, status, statusClass, score4, note = '';
    let isFailed = false;

    if (totalWeight < 100) {
        note = `Lưu ý: Tổng trọng số hiện tại là ${totalWeight}%, không phải 100%.`;
    }

    // Logic điểm liệt của HUFLIT không dựa trên điểm thi cuối kỳ (theo ảnh)
    // mà chỉ dựa trên điểm tổng kết

    // --- Chuyển điểm hệ 10 sang điểm chữ ---
    // Dựa trên huflit1.jpg và giả định lấp đầy khoảng trống (6.0-6.9 là C+)
    if (finalScore10 >= 9.0) {
        letterGrade = 'A+'; // (9.0 - 10)
    } else if (finalScore10 >= 8.5) {
        letterGrade = 'A'; // (8.5 - 8.9)
    } else if (finalScore10 >= 8.0) {
        letterGrade = 'B+'; // (8.0 - 8.4)
    } else if (finalScore10 >= 7.0) {
        letterGrade = 'B'; // (7.0 - 7.9)
    } else if (finalScore10 >= 6.0) { 
        letterGrade = 'C+'; // (6.0 - 6.9) -> *GIẢ ĐỊNH* dựa trên khoảng trống giữa B (7.0) và C (5.5)
    } else if (finalScore10 >= 5.5) {
        letterGrade = 'C'; // (5.5 - 5.9)
    } else if (finalScore10 >= 5.0) {
        letterGrade = 'D+'; // (5.0 - 5.4)
    } else if (finalScore10 >= 4.0) {
        letterGrade = 'D'; // (4.0 - 4.9)
    } else {
        letterGrade = 'F'; // (< 4.0)
        isFailed = true;
    }

    // --- Chuyển điểm chữ sang hệ 4 ---
    // Dựa trên huflit2.jpg
    switch (letterGrade) {
        case 'A+': score4 = 4.0; break;
        case 'B+': score4 = 3.5; break;
        case 'B':  score4 = 3.0; break;
        case 'C+': score4 = 2.5; break;
        case 'C':  score4 = 2.0; break;
        case 'D+': score4 = 1.5; break;
        case 'D':  score4 = 1.0; break;
        case 'F':  score4 = 0.0; break;
        case 'A':  
            score4 = 0.0; // Điểm 'A' không được quy định trong huflit portal
            note += (note ? '<br>' : '') + 'Lưu ý: Điểm chữ "A" (8.5-8.9) không được quy định trong thang điểm 4 (theo huflit portal) và có thể không được tính vào GPA.';
            break;
        default: score4 = 0.0;
    }

    // --- Xếp loại ---
    // Dựa trên huflit (Xếp loại theo điểm hệ 4)
    if (score4 >= 3.6) {
        classification = 'Xuất sắc';
    } else if (score4 >= 3.2) {
        classification = 'Giỏi';
    } else if (score4 >= 2.5) {
        classification = 'Khá';
    } else if (score4 >= 2.0) {
        classification = 'Trung bình';
    } else if (score4 >= 1.0) {
        classification = 'Yếu';
    } else {
        classification = 'Kém';
    }

    // --- Trạng thái cuối cùng ---
//F là dưới 4.0
    if (isFailed) {
        status = 'Nợ môn'; 
        statusClass = 'bg-red-600 text-white';
        classification = 'Kém';
        score4 = 0.0;
        letterGrade = 'F';
    } else {
        status = 'Qua môn'; 
        statusClass = 'bg-green-600 text-white';
    }

    note += (note ? '<br>' : '') + 'Kết quả được tính theo thang điểm 10 (làm tròn 1 chữ số thập phân).';

    // Trả về điểm hệ 10
    return { 
        finalScore: finalScore10, // Hiển thị điểm hệ 10
        letterGrade, 
        score4: score4.toFixed(1), // Hiển thị hệ 4 (làm tròn 1 CSDP cho nhất quán)
        classification, 
        status, 
        statusClass, 
        note, 
        isFailed 
    };
};

    // === BỘ ĐIỀU HƯỚNG TÍNH TOÁN (MỚI) ===
    const gradingAlgorithms = {
        'eiu': calculateGrade_EIU,
        'uit': calculateGrade_UIT,
        'bdu': calculateGrade_BDU,
        'huflit': calculateGrade_HUFLIT, // <--- ĐÃ THÊM HUFLIT
        'hcmut': calculateGrade_UIT, // Giả sử HCMUT giống UIT
    };

    // Lấy hàm tính toán dựa trên trường đang chọn (currentUniversityKey)
    const calculateGrade = gradingAlgorithms[currentUniversityKey] || calculateGrade_EIU; // Mặc định về EIU nếu không tìm thấy

    // Chuẩn bị dữ liệu đầu vào (đã được chuẩn hóa hệ 100)
    const inputs = {
        totalWeightedScore,
        finalExamScore,
        totalWeight
    };

    // Gọi hàm tính toán
    const result = calculateGrade(inputs);

    // === CẬP NHẬT UI (DÙNG KẾT QUẢ TỪ `result` object) ===

    // Cập nhật GHI CHÚ (NOTE) trước
    const noteEl = document.getElementById('note');
    noteEl.className = 'text-center font-medium mt-4 text-sm'; // Reset class
    noteEl.innerHTML = result.note || ''; // Lấy ghi chú từ object

    // Thêm class màu dựa trên trạng thái
    if (result.isFailed) {
        noteEl.classList.add('text-red-600', 'dark:text-red-400');
    } else if (totalWeight < 100) {
        noteEl.classList.add('text-orange-600', 'dark:text-orange-400');
    } else if (!noteEl.innerHTML) {
         // Nếu không có lỗi gì, thêm một ghi chú mặc định
        noteEl.innerHTML = `Quy tắc tính điểm của ${universities[currentUniversityKey].shortName} đã được áp dụng.`;
        noteEl.classList.add('text-slate-500', 'dark:text-slate-400');
    }

    // Cập nhật các trường kết quả
    document.getElementById('total-weight').textContent = `${totalWeight}%`;

    // Cập nhật tiêu đề điểm (một số trường dùng hệ 10)
    const finalScoreLabel = document.getElementById('final-score-label'); // Lấy ID đã thêm ở Bước 1

    // Kiểm tra xem thang điểm là 10 hay 100
    if (scale === 10) {
        finalScoreLabel.textContent = 'Điểm tổng kết (hệ 10):';
        document.getElementById('final-score').textContent = result.finalScore.toFixed(1); // Hệ 10 làm tròn 1 CSDP
    } else {
        finalScoreLabel.textContent = 'Điểm tổng kết (hệ 100):';
        document.getElementById('final-score').textContent = result.finalScore.toFixed(2); // Hệ 100 làm tròn 2 CSDP
    }

    document.getElementById('score-4').textContent = result.score4;
    document.getElementById('letter-grade').textContent = result.letterGrade;
    document.getElementById('classification').textContent = result.classification;

    const statusEl = document.getElementById('status');
    statusEl.textContent = result.status;
    statusEl.className = `font-bold text-xl px-4 py-1.5 rounded-full ${result.statusClass}`;

    resultDiv.classList.remove('hidden');
});

    // --- Sự kiện cho hộp thoại thông báo ---
    alertOkBtn.addEventListener('click', hideCustomAlert);
    alertBackdrop.addEventListener('click', (e) => {
        if (e.target === alertBackdrop) hideCustomAlert();
    });

// === KHỞI TẠO BAN ĐẦU ===
loadSavedUniversity();      // <-- GỌI HÀM NÀY TRƯỚC
loadDataFromLocalStorage(); // <-- GỌI HÀM NÀY SAU
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