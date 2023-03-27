(function () {

    const host = window.location.host;
    if (host !== "ielts.neea.cn") {
        alert("请勿在非ielts.neea.cn激活本黑科技");
        return;
    }
    const https = 'https:' === document.location.protocol;
    if (!https) {
        alert("请使用ielts.neea.cn的https版本");
        window.location.href = "https://ielts.neea.cn/login";
        return;
    }

    const url = window.location.href;
    const url_info = url.match(/myHome\/(\d+)\//);
    let ielts_id = 0;
    try {
        ielts_id = url_info[1];
    } catch (e) {
        ielts_id = 0;
    }
    if (ielts_id === 0) {
        alert("获取报名ID失败，请先登录雅思考试报名网站");
        window.location.href = "https://ielts.neea.cn/login";
        return;
    }
    const base_url = "https://ielts.neea.cn/myHome/" + ielts_id + "/";

    const show = `
<div
    id="test"
    style="top: 0;right: 0;bottom: 0;left: 0;height: 100%;width: 100%;position: fixed;background-color: #fff;padding-top: 70px;font-family: Helvetica Neue, Helvetica, Arial, 'Microsoft YaHei';, sans-serif;z-index: 999;overflow-x:hidden;overflow-y:auto;display:none;"
>
    <audio id="test_audio">
        <source src="https://www.onlyke.com/ielts/notice.ogg" type="audio/ogg" style="display: none;" />
        <source src="https://www.onlyke.com/ielts/notice.mp3" type="audio/mpeg" />
    </audio>
    <div class="container">
        <div class="row">
            <div class="col-md-12">
                <div class="page-header">
                    <h1>雅思考试考位检测工具</h1>
                    <a href="https://www.onlyke.com/html/593.html" target="_blank"><span class="label label-default">更多访问：www.onlyke.com</span></a>
                </div>
            </div>
        </div>
        <div class="row" id="process-0">
            <div class="col-md-12">
                <div class="progress progress-striped active"><div class="progress-bar progress-bar-success" role="progressbar" aria-valuenow="0" aria-valuemin="0" aria-valuemax="100" style="width: 100%;">检测环境中，请稍等...</div></div>
            </div>
        </div>
        <div class="row" id="process-1" style="display: none;">
            <div class="col-md-12">
                <div class="alert alert-danger">清先登录雅思报名网站</div>
                <a class="btn btn-primary" href="https://ielts.neea.cn/login">去登陆</a>
            </div>
        </div>
        <div class="row" id="process-2" style="display: none;">
            <div class="col-md-12">
                <div class="alert alert-info">清选择监控的考试种类</div>
                <button type="button" class="btn btn-info" id="test_normal">普通考试</button><button type="button" class="btn btn-warning ml-xs" id="test_visa">用于签证</button>
            </div>
        </div>
        <div class="row" id="process-3" style="display: none;">
            <div class="col-md-12">
                <div class="alert alert-info">请选择监控的场次，可以使用Ctrl和Shift多选</div>
                <form>
                    <div class="form-group">
                        <label>城市</label>
                        <select multiple class="form-control" id="city"></select>
                    </div>
                    <div class="form-group">
                        <label>考试时间</label>
                        <select multiple class="form-control" id="date"></select>
                    </div>
                </form>
                <button type="button" class="btn btn-success" id="test_start">开始</button>
            </div>
        </div>
        <div class="row" id="process-4" style="display: none;">
            <div class="col-md-12">
                <div class="alert alert-info">我正在为您持续监控考位，退出请刷新</div>
                <div class="progress progress-striped active" id="table_load">
                    <div class="progress-bar progress-bar-warning" role="progressbar" aria-valuenow="0" aria-valuemin="0" aria-valuemax="100" style="width: 100%;">正在获取考位...</div>
                </div>
                <div class="progress progress-striped active" id="table_finish" style="display: none;">
                    <div class="progress-bar progress-bar-info" role="progressbar" aria-valuenow="0" aria-valuemin="0" aria-valuemax="100" style="width: 100%;">稍后将刷新...</div>
                </div>
                <table class="table table-bordered table-striped table-vcenter">
                    <thead>
                        <tr>
                            <th>城市</th>
                            <th>地点</th>
                            <th>类别</th>
                            <th>考试时间</th>
                            <th>状态</th>
                            <th>考位提醒</th>
                        </tr>
                    </thead>
                    <tbody id="table_content"></tbody>
                </table>
            </div>
        </div>
    </div>
</div>
`;

    const script = `
<script src="//cdn.jsdelivr.net/npm/bootstrap3@3.3.5/dist/js/bootstrap.min.js"></script>
<link href="//cdn.jsdelivr.net/npm/bootstrap3@3.3.5/dist/css/bootstrap.min.css" rel="stylesheet" />
<style>
    .m-none {
        margin: 0 !important;
    }
    .m-auto {
        margin: 0 auto !important;
    }
    .m-xs {
        margin: 5px !important;
    }
    .m-sm {
        margin: 10px !important;
    }
    .m-md {
        margin: 15px !important;
    }
    .m-lg {
        margin: 20px !important;
    }
    .m-xl {
        margin: 25px !important;
    }
    .m-xlg {
        margin: 30px !important;
    }
    .mt-none {
        margin-top: 0 !important;
    }
    .mt-xs {
        margin-top: 5px !important;
    }
    .mt-sm {
        margin-top: 10px !important;
    }
    .mt-md {
        margin-top: 15px !important;
    }
    .mt-lg {
        margin-top: 20px !important;
    }
    .mt-xl {
        margin-top: 25px !important;
    }
    .mt-xlg {
        margin-top: 30px !important;
    }
    .mb-none {
        margin-bottom: 0 !important;
    }
    .mb-xs {
        margin-bottom: 5px !important;
    }
    .mb-sm {
        margin-bottom: 10px !important;
    }
    .mb-md {
        margin-bottom: 15px !important;
    }
    .mb-lg {
        margin-bottom: 20px !important;
    }
    .mb-xl {
        margin-bottom: 25px !important;
    }
    .mb-xlg {
        margin-bottom: 30px !important;
    }
    .mr-none {
        margin-left: 0 !important;
    }
    .ml-xs {
        margin-left: 5px !important;
    }
    .ml-sm {
        margin-left: 10px !important;
    }
    .ml-md {
        margin-left: 15px !important;
    }
    .ml-lg {
        margin-left: 20px !important;
    }
    .ml-xl {
        margin-left: 25px !important;
    }
    .ml-xlg {
        margin-left: 30px !important;
    }
    .mr-none {
        margin-right: 0 !important;
    }
    .mr-xs {
        margin-right: 5px !important;
    }
    .mr-sm {
        margin-right: 10px !important;
    }
    .mr-md {
        margin-right: 15px !important;
    }
    .mr-lg {
        margin-right: 20px !important;
    }
    .mr-xl {
        margin-right: 25px !important;
    }
    .mr-xlg {
        margin-right: 30px !important;
    }
    .table.table-vcenter th,
    .table.table-vcenter td {
        vertical-align: middle;
    }
</style>
    `;
    const $body = $("body");
    $body.css("overflow-y", "hidden");

    let product = "IELTSPBT";
    const city = [];
    const date = [];
    const select = [];
    let ajax_count = 0;
    const notice = [];

    init();

    function init() {
        $("head link").remove();
        $("head").append(script);
        $body.append(show);

        setTimeout(function () {
            $("#test").fadeIn('slow', function () {
                checkLogin();
            });
        }, 1000);

        $("#test_normal").click(function (event) {
            product = "IELTSPBT";
            test_setting();
        });
        $("#test_visa").click(function (event) {
            product = "IELTSUKVI";
            test_setting();
        });
        $("#test_start").click(function (event) {
            Notification.requestPermission();
            test_start();
        });
        $("#table_content").on('click', '.test_notice', function (event) {
            const checked = $(this).is(':checked');
            const id = $(this).val();
            if (checked) {
                notice.push(id);
            } else {
                notice.splice($.inArray(id, notice), 1);
            }
            console.log(notice);
        });
    }

    function checkLogin() {
        $.ajax({
            cache: false,
            url: base_url + 'showProfile',
            type: 'GET',
            dataType: 'text',
            //async: false,
            error: function (request) {
                alert("登录检测失败，请刷新本网页");
            },
            success: function (data) {
                const find = data.indexOf("无效的会话");
                if (find > -1) {
                    needLogin();
                } else {
                    test_choose();
                }
            }
        });
    }

    function needLogin() {
        $("#process-0").hide();
        $("#process-1").show();
    }

    function test_choose() {
        $("#process-0").hide();
        $("#process-2").show();
    }

    function test_setting() {
        $.ajax({
            cache: false,
            url: base_url + 'querySeat?productId=' + product,
            type: 'GET',
            dataType: 'html',
            error: function (request) {
                alert("检测考试信息失败，请刷新本网页");
            },
            success: function (data) {
                const page = $(data);
                page.find("#provinces").find("input[name='mvfSiteProvinces']").each(function () {
                    const el = $(this);
                    const city_value = trim(el.val());
                    const city_name = trim(el.parent().text());
                    $('#city').append('<option value="' + city_value + '">' + city_name + '</option>');
                });
                page.find("#months").find("input[type='checkbox']").each(function () {
                    const el = $(this);
                    const date_value = trim(el.val());
                    const date_name = trim(el.parent().text());
                    $('#date').append('<option value="' + date_value + '">' + date_name + '</option>');
                });
                $("#process-2").hide();
                $("#process-3").show();
            },
        });

    }

    function test_start() {
        const date = [];
        const date_select = $("#date").val();
        for (let i = 0; i < date_select.length; i++) {
            const date_value = date_select[i];
            const date_name = $('#date').find('option[value="' + date_value + '"]').text();
            date.push({
                'date_value': date_value,
                'date_name': date_name
            });
        }

        const city = $("#city").val();
        for (let u = 0; u < city.length; u++) {
            const city_value = city[u];
            const city_name = $('#city').find('option[value="' + city_value + '"]').text();
            for (let o = 0; o < date.length; o++) {
                const a = {
                    'city_value': city_value,
                    'city_name': city_name
                };
                $.extend(a, date[o]);
                select.push(a);
            }
        }
        $("#process-3").hide();
        $("#process-4").show();
        setTimeout(function () {
            test_load();
        }, 1000);
    }

    function test_load() {
        $("#table_finish").hide();
        $("#table_load").show();
        $("#table_content").html("");
        for (let s = 0; s < select.length; s++) {
            const city_value = select[s].city_value;
            const city_name = select[s].city_name;
            const date_value = select[s].date_value;
            const date_name = select[s].date_name;
            if (s === select.length - 1) {
                finish = 1;
            }
            ajax_count++;
            test_open(date_value, city_value);
        }
        setTimeout(function () {
            test_finish();
        }, 2000);
    }

    function test_finish() {
        console.log(ajax_count);
        if (ajax_count <= 0) {
            ajax_count = 0;
            $("#table_load").hide();
            $("#table_finish").show();
            setTimeout(function () {
                test_load();
            }, 5000);
        } else {
            setTimeout(function () {
                test_finish();
            }, 1000);
        }
    }

    function test_open(date_value, city_value) {
        $.ajax({
            timeout: 3000,
            cache: false,
            url: base_url + 'queryTestSeats?queryMonths=' + date_value + "&queryProvinces=" + city_value + "&neeaAppId=&productId=" + product,
            type: 'GET',
            dataType: 'json',
            complete: function (msg) {
                ajax_count--;
            },
            success: function (data) {
                for (var time_key in data) {
                    var raw = data[time_key];
                    if (raw === "Error") {
                        break;
                    }
                    for (var id in raw) {
                        var item = raw[id];
                        var seat_id = item.seatGuid;
                        var time = item.adminDateCn;
                        var type = item.levelCode;
                        var reg_end = item.registerEndTimeDescCn;
                        var location = item.centerNameCn;
                        var province = item.provinceNameCn;
                        var opt_status = item.optStatusCn;
                        var status = "";
                        var look = '<input id="' + seat_id + '" value="' + seat_id + '" type="checkbox" class="test_notice" ';
                        var notice_find = $.inArray(seat_id, notice);
                        if (opt_status === "名额暂满") {
                            status = '<span class="label label-danger">无考位</span>';
                            if (notice_find === -1) {
                                look += '>';
                            } else {
                                look += 'checked>';
                            }
                        } else {
                            status = '<span class="label label-success">有考位</span>';
                            if (notice_find === -1) {
                                look += 'disabled>';
                            } else {
                                sendMessage(seat_id, province, location, time);
                                look += 'checked>';
                            }
                        }
                        var html = '<tr><td>' + province + '</td><td>' + location + '</td><td>' + type + '</td><td>' + time + '</td><td>' + status + '</td><td>' + look + '</td></tr>';
                        $("#table_content").append(html);
                    }
                }
            },
        });
    }

    function sendMessage(seat_id, province, location, time) {
        if (Notification.permission === 'granted') {
            new Notification('找到考位', {
                body: "省份：" + province + "，地点：" + location + "，考试时间：" + time,
                icon: "https://ielts.neea.cn/images/blogo.png",
                tag: seat_id
            });
            $('#test_audio')[0].play();
        }
    }

    function trim(text) {
        return text.replace(/[\s]/g, "");
    }

})();
