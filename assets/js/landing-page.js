(function($) {
    'use strict';

    $(initializePage);

    function initializePage() {
        const token = getTokenFromUrl();
        if (token) {
            checkToken(token);
        }
        chartOrg();
    }

    function getTokenFromUrl() {
        const urlParams = new URLSearchParams(window.location.search);
        return urlParams.get('token');
    }

    async function checkToken(token) {
        $('#bar-loader').removeClass('d-none');

        try {
            const response = await fetch('login/third_party', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
                body: new URLSearchParams({token: token}).toString()
            });

            await new Promise(resolve => setTimeout(resolve, 500));

            const result = await response.json();

            if (result.status === 'success') {
                displayToast('Success', 'Login successful, redirecting to Dashboard...', 'success');
                setTimeout(() => {
                    window.location.href = config.siteUrl + 'dashboard';
                }, 1500);
            } else {
                displayToast('Error', result.message, 'error');
            }
        } catch (error) {
            displayToast('Error', 'Error while trying to check token', 'error');
        } finally {
            $('#bar-loader').addClass('d-none');
        }
    }

    function chartOrg() {
        var nodes = [
            { id: 1, name: "Rian", title: "RUPS", img: config.siteUrl + 'assets/images/faces/face' + Math.floor(Math.random() * 27 + 1) + '.jpg' },
            
            // Dewan Komisaris
            { id: 2, pid: 1, name: "Budi Santoso", title: "Dewan Komisaris", img: config.siteUrl + 'assets/images/faces/face' + Math.floor(Math.random() * 27 + 1) + '.jpg' },
    
            // Direktur Utama
            { id: 3, pid: 1, name: "Andi Wijaya", title: "Direktur Utama", img: config.siteUrl + 'assets/images/faces/face' + Math.floor(Math.random() * 27 + 1) + '.jpg' },
            { id: 4, pid: 3, name: "Citra Dewi", title: "Divisi Pengawasan", img: config.siteUrl + 'assets/images/faces/face' + Math.floor(Math.random() * 27 + 1) + '.jpg' },
            { id: 5, pid: 3, name: "Dewi Lestari", title: "Direktur Kepatuhan", img: config.siteUrl + 'assets/images/faces/face' + Math.floor(Math.random() * 27 + 1) + '.jpg' },
            { id: 6, pid: 3, name: "Eko Prasetyo", title: "Direktur Keuangan dan Teknologi Informasi", img: config.siteUrl + 'assets/images/faces/face' + Math.floor(Math.random() * 27 + 1) + '.jpg' },
            { id: 7, pid: 3, name: "Fajar Nugroho", title: "Direktur Pemasaran", img: config.siteUrl + 'assets/images/faces/face' + Math.floor(Math.random() * 27 + 1) + '.jpg' },
            { id: 8, pid: 3, name: "Gita Permata", title: "Direktur Bisnis & Syariah", img: config.siteUrl + 'assets/images/faces/face' + Math.floor(Math.random() * 27 + 1) + '.jpg' },
    
            // Direktur Kepatuhan
            { id: 9, pid: 5, name: "Hadi Susanto", title: "Divisi Kepatuhan", img: config.siteUrl + 'assets/images/faces/face' + Math.floor(Math.random() * 27 + 1) + '.jpg' },
            { id: 10, pid: 5, name: "Indra Kurniawan", title: "Divisi Manajemen Risiko", img: config.siteUrl + 'assets/images/faces/face' + Math.floor(Math.random() * 27 + 1) + '.jpg' },
            { id: 11, pid: 5, name: "Joko Widodo", title: "UKK APU & PTT", img: config.siteUrl + 'assets/images/faces/face' + Math.floor(Math.random() * 27 + 1) + '.jpg' },
    
            // Direktur Keuangan dan Teknologi Informasi
            { id: 12, pid: 6, name: "Kiki Amalia", title: "Divisi Akuntansi dan Perencanaan", img: config.siteUrl + 'assets/images/faces/face' + Math.floor(Math.random() * 27 + 1) + '.jpg' },
            { id: 13, pid: 6, name: "Lina Marlina", title: "Divisi Tresuri", img: config.siteUrl + 'assets/images/faces/face' + Math.floor(Math.random() * 27 + 1) + '.jpg' },
            { id: 14, pid: 6, name: "Maya Sari", title: "Divisi Teknologi Informasi", img: config.siteUrl + 'assets/images/faces/face' + Math.floor(Math.random() * 27 + 1) + '.jpg' },
            { id: 15, pid: 6, name: "Nina Agustina", title: "Divisi Umum", img: config.siteUrl + 'assets/images/faces/face' + Math.floor(Math.random() * 27 + 1) + '.jpg' },
    
            //Direktur Utama
            { id: 16, pid: 3, name: "Oki Setiawan", title: "Sekretariat Perusahaan", img: config.siteUrl + 'assets/images/faces/face' + Math.floor(Math.random() * 27 + 1) + '.jpg' },
            { id: 17, pid: 3, name: "Putu Widi", title: "Divisi Sumber Daya Manusia", img: config.siteUrl + 'assets/images/faces/face' + Math.floor(Math.random() * 27 + 1) + '.jpg' },
            { id: 18, pid: 3, name: "Qori Rahma", title: "Divisi Startegi & Transformasi", img: config.siteUrl + 'assets/images/faces/face' + Math.floor(Math.random() * 27 + 1) + '.jpg' },
            { id: 99, pid: 18, name: "Hadi Adriansyah", title: "TKD", img: config.siteUrl + 'assets/images/faces/hadi.jpg' },
    
            // Direktur Pemasaran
            { id: 19, pid: 7, name: "Rina Sari", title: "Divisi Dana & Jasa", img: config.siteUrl + 'assets/images/faces/face' + Math.floor(Math.random() * 27 + 1) + '.jpg' },
            { id: 20, pid: 7, name: "Siti Aminah", title: "Divisi Credit Review", img: config.siteUrl + 'assets/images/faces/face' + Math.floor(Math.random() * 27 + 1) + '.jpg' },
            { id: 21, pid: 7, name: "Tina Kartika", title: "Divisi Operasional", img: config.siteUrl + 'assets/images/faces/face' + Math.floor(Math.random() * 27 + 1) + '.jpg' },
    
            // Direktur
            { id: 22, pid: 3, name: "Umar Bakri", title: "Kantor Cabang", img: config.siteUrl + 'assets/images/faces/face' + Math.floor(Math.random() * 27 + 1) + '.jpg' },
            { id: 23, pid: 22, name: "Vina Melati", title: "KC Pembantu", img: config.siteUrl + 'assets/images/faces/face' + Math.floor(Math.random() * 27 + 1) + '.jpg' },
    
            // Direktur Bisnis & Syariah
            { id: 24, pid: 8, name: "Wawan Setiawan", title: "Divisi Kredit", img: config.siteUrl + 'assets/images/faces/face' + Math.floor(Math.random() * 27 + 1) + '.jpg' },
            { id: 25, pid: 8, name: "Xena Putri", title: "Divisi Ritel", img: config.siteUrl + 'assets/images/faces/face' + Math.floor(Math.random() * 27 + 1) + '.jpg' },
            { id: 26, pid: 8, name: "Yudi Pratama", title: "Divisi Penyelamatan Kredit", img: config.siteUrl + 'assets/images/faces/face' + Math.floor(Math.random() * 27 + 1) + '.jpg' },
            { id: 27, pid: 8, name: "Zaki Ramadhan", title: "Unit Usaha Syariah", img: config.siteUrl + 'assets/images/faces/face' + Math.floor(Math.random() * 27 + 1) + '.jpg' },
    
            // Unit Usaha Syariah
            { id: 28, pid: 27, name: "Agus Salim", title: "Kantor Cabang Syariah", img: config.siteUrl + 'assets/images/faces/face' + Math.floor(Math.random() * 27 + 1) + '.jpg' },
            { id: 29, pid: 28, name: "Bambang Hartono", title: "KC Pembantu Syariah", img: config.siteUrl + 'assets/images/faces/face' + Math.floor(Math.random() * 27 + 1) + '.jpg' },
    
            // Dewan Pengawas Syariah
            { id: 30, pid: 1, name: "Cahyo Budi", title: "Dewan Pengawas Syariah", img: config.siteUrl + 'assets/images/faces/face' + Math.floor(Math.random() * 27 + 1) + '.jpg' },
          ];
    
          for (var i = 0; i < nodes.length; i++) {
            var node = nodes[i];
            switch (node.title) {
                case "RUPS":
                case "Direktur Utama":
                case "Dewan Komisaris":
                case "Dewan Pengawas Syariah":
                case "Unit Usaha Syariah":
                    node.tags = ["RUPS"];
                    break;
                case "Direktur Kepatuhan":
                case "Direktur Keuangan dan Teknologi Informasi":
                case "Direktur Pemasaran":
                case "Direktur Bisnis & Syariah":
                case "Kantor Cabang":
                case "Kantor Cabang Syariah":
                    node.tags = ["Direktur"];
                    break;
            }
        }
    
          var chart = new OrgChart(document.getElementById("tree"), {    
            mouseScrool: OrgChart.action.scroll,
            scaleInitial: 0.6,
            mode: 'dark',
            layout: OrgChart.mixed,
            nodeBinding: {
                field_0: "title",
                  field_1: "name",
                  img_0: "img"
              }
          });
    
        chart.load(nodes);
    }
})(jQuery);
