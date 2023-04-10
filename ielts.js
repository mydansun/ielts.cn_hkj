(function () {
    const $body = $("body");

    function main() {
        if (window.location.host !== "ielts.neea.cn") {
            alert("请勿在非ielts.neea.cn激活本黑科技");
            return;
        }
        if (document.location.protocol !== 'https:') {
            alert("请使用ielts.neea.cn的https版本");
            window.location.href = "https://ielts.neea.cn/login";
            return;
        }
        if (window.__hkj) {
            alert("请勿重复加载黑科技");
            return;
        }
        window.__hkj = true;

        const currentUrl = window.location.href;
        const matchResult = currentUrl.match(/myHome\/(\d+)\//);
        if (!matchResult || matchResult.length < 2 || !matchResult[1]) {
            alert("获取报名ID失败，请先登录雅思考试报名网站");
            window.location.href = "https://ielts.neea.cn/login";
            return;
        }
        loadAssets().then().catch(reason => {
            console.error(reason);
        });
    }

    async function loadAssets() {
        const loadingHtml = `
        <div id="__hkj_loading" style="
        top: 0;
        right: 0;
        bottom: 0;
        left: 0;
        height: 100%;
        width: 100%;
        position: fixed;
        background-color: #fff;
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 30px;
        z-index: 1000;
        overflow-x:hidden;
        overflow-y:auto;
        ">
            <h1>Loading...</h1>
        </div>
        `
        const assetsHtml = `
        <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css">
        <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/element-ui@2.15.13/lib/theme-chalk/index.css">
        <style>
            .rainbow {
                font-family: 'Roboto', sans-serif;
                background: linear-gradient(to right, #6666ff, #0099ff, #00ff00, #ff3399, #6666ff);
                -webkit-background-clip: text;
                color: transparent;
                animation: rainbow_animation 6s ease-in-out infinite;
                background-size: 400% 100%;
            }
            @keyframes rainbow_animation {
                0%, 100% {
                    background-position: 0 0;
                }
    
                50% {
                    background-position: 100% 0;
                }
            }
            .el-loading-spinner .circular{
                display: inline;
            }
            
            #__hkj_app_container{
                top: 0;
                right: 0;
                bottom: 0;
                left: 0;
                height: 100%;
                width: 100%;
                position: fixed;
                background-color: #fff;
                z-index: 1001;
                overflow-x:hidden;
                overflow-y:auto;
            }
            
            #__hkj_app{
                padding: 30px;
            }
        </style>
        `;
        $body.css("overflow-y", "hidden");
        $body.append(loadingHtml);
        $("head link").remove();
        $("head").append(assetsHtml);
        const scripts = [
            "https://cdn.jsdelivr.net/npm/vue@2.7.14/dist/vue.js",
            "https://cdn.jsdelivr.net/npm/element-ui@2.15.13/lib/index.min.js"
        ];
        for (const script of scripts) {
            await new Promise((resolve, reject) => {
                const el = document.createElement('script');
                el.src = script;
                el.onload = (e) => {
                    console.log(script + ' loaded!');
                    resolve();
                };
                el.onerror = (e) => {
                    reject(e);
                }
                document.head.append(el);
            });
        }
        initApp();
    }

    function initApp() {
        const appHtml = `
        <div id="__hkj_app_container">
            <div id="__hkj_app">
                <h2 class="rainbow text-5xl mb-1">{{ title }}</h2>
                <p class="mb-1"><a href="https://github.com/mydansun/ielts.cn_hkj" target="_blank">https://github.com/mydansun/ielts.cn_hkj</a></p>
                <hr class="my-2">
                <section class="mb-4" v-if="queryCities.length > 0">
                    <el-button type="warning" @click="resetQuery" v-if="!fetching">重置选择</el-button>
                    <el-button type="danger" @click="refreshPage" v-if="fetching">正在刷新考位，点此刷新网页以强行终止</el-button>
                </section>
                <section class="mb-4">
                    <div class="mb-3">
                        <p class="mb-1">请选择考试类别</p>
                        <el-select v-model="selectedProductCode" placeholder="请选择" :disabled="typeCityDisabled" style="width: 200px;">
                            <el-option :key="product.value" :value="product.value" v-for="product in products" :label="product.name"></el-option>
                        </el-select>
                    </div>
                    <template v-if="cites.length > 0 && !typeCityDisabled">
                        <div class="mb-3">
                            <p class="mb-1">请选择下一步查询的考试城市（可多选）</p>
                            <el-select v-model="selectedCites" placeholder="请选择" multiple filterable style="width: 400px;">
                                <el-option :key="city.value" :value="city" v-for="city in cites" :label="city.name">
                                </el-option>
                            </el-select>
                        </div>
                        <el-button type="primary" @click="updateCities">
                            下一步
                        </el-button>
                    </template>
                    <hr class="my-2">
                </section>
                <section class="mb-4" v-if="queryCities.length > 0">
                    <div class="mb-3">
                        <p class="mb-1">下面是你选择的城市</p>
                        <ul class="list-disc list-inside">
                            <li v-for="queryCity in queryCities" :key="queryCity.value">
                                {{ queryCity.name }}
                                <code>{{ queryCity.value }}</code>
                            </li>
                        </ul>
                    </div>
                    <template v-if="!dateDisabled">
                        <div class="mb-3" v-if="availableDates.length > 0">
                            <p class="mb-1">根据你选择的城市，可用的考试日期如下，请选择要查询日期（可多选）</p>
                            <el-select v-model="selectedDates" placeholder="请选择" multiple filterable style="width: 400px;">
                                <el-option :value="availableDate" v-for="availableDate in availableDates" :key="availableDate" :label="availableDate">
                                </el-option>
                            </el-select>
                        </div>
                        <el-button type="primary" @click="updateDates">
                            下一步
                        </el-button>
                    </template>
                    <hr class="my-2">
                </section>
                <section class="mb-4" v-if="queryDates.length > 0">
                    <div class="mb-3">
                        <p class="mb-1">下面是你选择的日期</p>
                        <ul class="list-disc list-inside">
                            <li v-for="queryDate in queryDates" :key="queryDate">
                                {{ queryDate }}
                            </li>
                        </ul>
                    </div>
                    <hr class="my-2">
                    <div class="mb-3">
                        <p class="mb-1">
                            下面是查询到的可以报考的考位
                            <span class="rainbow">
                                （<strong v-if="lastUpdated">更新于 {{ lastUpdated }}</strong> | 每隔 {{ refreshInterval / 1000 }} 秒自动刷新中...）
                            </span>
                        </p>
                        <el-table :data="tests" border stripe style="width: 100%" row-key="seatId">
                            <el-table-column
                                sortable
                                prop="cityName"
                                label="城市">
                            </el-table-column>
                            
                            <el-table-column
                                sortable
                                prop="testDay"
                                label="日期">
                            </el-table-column>
                            
                            <el-table-column
                                sortable
                                prop="testTime"
                                label="时间">
                            </el-table-column>
                            
                            <el-table-column
                                sortable
                                prop="centerName"
                                label="考点">
                            </el-table-column>
                            
                            <el-table-column
                                sortable
                                prop="levelCode"
                                label="考试级别">
                            </el-table-column>
                               
                            <el-table-column
                                sortable
                                prop="writtenType"
                                label="考试类型">
                            </el-table-column>
                            
                            <el-table-column
                                sortable
                                prop="speakType"
                                label="口试类型">
                            </el-table-column>
                        </el-table>
                    </div>
                </section>
            </div>
        </div>
        `
        $body.append(appHtml);
        new Vue({
            el: '#__hkj_app',
            data: function () {
                return {
                    title: '雅思黑科技',
                    selectedProductCode: "",
                    queryProductCode: "",
                    products: [
                        {
                            value: "IELTSPBT",
                            name: "普通雅思 纸笔考试"
                        },
                        {
                            value: "IELTSCDI",
                            name: "普通雅思 机考"
                        },
                        {
                            value: "IELTSUKVIPBT",
                            name: "签证移民雅思 纸笔考试"
                        },
                        {
                            value: "IELTSUKVICDI",
                            name: "签证移民雅思 机考"
                        },
                    ],
                    cites: [],
                    selectedCites: [],
                    queryCities: [],
                    availableDates: [],
                    selectedDates: [],
                    queryDates: [],
                    tests: [],
                    csrfToken: $("meta[name='_csrf']").attr("content"),
                    sessionHandle: null,
                    refreshHandle: null,
                    loading: null,
                    refreshInterval: 30 * 1000,
                    lastUpdated: "",
                    foundSeatIds: [],
                    fetching: false,
                }
            },
            computed: {
                typeCityDisabled() {
                    return this.queryCities.length > 0;
                },
                dateDisabled() {
                    return this.queryDates.length > 0;
                }
            },
            mounted() {
                this.sessionHandle = setInterval(() => {
                    this.refreshToken();
                }, 30 * 1000);
            },
            methods: {
                initLoading() {
                    this.loading = this.$loading({
                        target: '#__hkj_app',
                    });
                },
                closeLoading() {
                    if (this.loading) {
                        this.loading.close();
                        this.loading = null;
                    }
                },
                resetQuery() {
                    this.initLoading();
                    this.cleanRefreshHandle();
                    this.tests = [];
                    this.queryDates = [];
                    this.selectedDates = [];
                    this.availableDates = [];
                    this.queryCities = [];
                    this.selectedCites = [];
                    this.cites = [];
                    this.queryProductCode = "";
                    this.selectedProductCode = "";
                    this.foundSeatIds = [];
                    this.closeLoading();
                },
                refreshPage() {
                    window.location.reload();
                },
                cleanRefreshHandle() {
                    if (this.refreshHandle) {
                        clearTimeout(this.refreshHandle);
                        this.refreshHandle = null;
                    }
                },
                async sleep(ms) {
                    return new Promise(resolve => {
                        setTimeout(() => {
                            resolve();
                        }, ms);
                    })
                },
                refreshToken() {
                    $.ajax({
                        type: "GET",
                        url: 'homepage',
                        success: (response) => {
                            const $document = $(response);
                            const newToken = $document.find("meta[name='_csrf']").attr("content");
                            if (newToken && newToken !== this.csrfToken) {
                                this.csrfToken = newToken;
                                console.log("csrfToken changed to %s", this.csrfToken);
                            }
                        }
                    })
                },
                async updateCities() {
                    this.initLoading();
                    this.queryProductCode = this.selectedProductCode;
                    this.queryCities.splice(0);
                    this.availableDates.splice(0);
                    this.queryCities = this.selectedCites.slice();
                    const availableDates = []
                    for (const {name, value} of this.queryCities) {
                        const data = await new Promise(resolve => {
                            $.getJSON("getTestDate", {productCode: this.queryProductCode, cityCode: value},
                                (data) => {
                                    resolve(data);
                                }
                            );
                        });
                        const dates = Object.keys(data);
                        console.log(`%s有%d个可用日期.`, name, dates.length);
                        for (const date of dates) {
                            if (!availableDates.includes(date)) {
                                availableDates.push(date);
                            }
                        }
                        await this.sleep(100);
                    }
                    availableDates.sort();
                    this.availableDates = availableDates;
                    this.closeLoading();
                },
                async updateDates() {
                    const permission = Notification.permission;
                    if (permission === "default") {
                        await new Promise(resolve => {
                            this.$confirm('是否打开浏览器通知，这将在有新考位时通知你', '提示', {
                                confirmButtonText: '打开',
                                cancelButtonText: '取消',
                                type: 'warning'
                            }).then(() => {
                                Notification.requestPermission().then((permission) => {
                                    if (permission === "granted") {
                                        this.$message.success('消息通知已打开，将在有考位的时候通知你');
                                    } else {
                                        this.$message.error('消息通知打开失败，无法通知新考位');
                                    }
                                    resolve();
                                });
                            }).catch(() => {
                                resolve();
                            });
                        });
                    } else if (permission === "denied") {
                        this.$message.error('消息通知权限被关闭，无法通知新考位');
                    } else if (permission === "granted") {
                        this.$message.success('消息通知已打开，将在有考位的时候通知你');
                    }
                    this.initLoading();
                    this.cleanRefreshHandle();
                    this.queryDates = this.selectedDates.slice();
                    const tests = await this.fetchSeats();
                    this.foundSeatIds = tests.map(test => test.seatId);
                    console.log("%d个城市总共查询到%d个考位", this.queryCities.length, tests.length, tests);
                    this.tests = tests;
                    this.refreshHandle = setTimeout(() => {
                        this.continuesUpdate();
                    }, this.refreshInterval);
                    this.closeLoading();
                },
                async continuesUpdate() {
                    const tests = await this.fetchSeats();
                    const foundSeatIds = tests.map(test => test.seatId);
                    const newSeatIds = foundSeatIds.filter(x => !this.foundSeatIds.includes(x));
                    if (newSeatIds.length > 0 && Notification.permission === 'granted') {
                        new Notification('雅思黑科技', {
                            body: "为你找到了新的考位",
                            icon: "https://ielts.neea.cn/project/ielts/v2/image/newlogo-4.png",
                            tag: newSeatIds[0],
                            requireInteraction: true
                        });
                    }
                    this.tests = tests;
                    this.foundSeatIds = Array.from(new Set(foundSeatIds.concat(this.foundSeatIds)));
                    console.log("已更新，%d个城市总共查询到%d个考位，新增考位%d", this.queryCities.length, tests.length, newSeatIds.length);
                    console.log(tests)
                    if (this.refreshHandle) {
                        this.refreshHandle = setTimeout(() => {
                            this.continuesUpdate();
                        }, this.refreshInterval);
                    }
                },
                async fetchSeats() {
                    this.fetching = true;
                    const tests = [];
                    this.lastUpdated = new Date().toLocaleString();
                    for (const {name, value} of this.queryCities) {
                        for (const date of this.queryDates) {
                            const data = new URLSearchParams();
                            data.append('productCode', this.queryProductCode);
                            data.append('queryCity', value);
                            data.append('queryTestDate', date);
                            data.append('queryActionType', 'Order.QueryOrder');
                            data.append('neeaAppId', '');
                            const responseData = await new Promise(resolve => {
                                $.ajax({
                                    type: "POST",
                                    headers: {
                                        "X-CSRF-TOKEN": this.csrfToken
                                    },
                                    dataType: "json",
                                    url: "queryTestSeats",
                                    data: data.toString(),
                                    success: (data) => {
                                        resolve(data);
                                    }
                                });
                            });
                            if (!responseData || !responseData?.testDay) {
                                console.log("%s在%s没有考位信息", name, date);
                            } else {
                                console.log("%s在%s有考位信息", name, date, responseData);
                            }
                            const cityData = {
                                cityCode: responseData.cityCode,
                                cityName: responseData.cityName,
                                testDay: responseData.testDay,
                                changeDeadline: responseData.rescheduleAndCancelDeadline,
                            };
                            const testSlots = responseData?.testSeats;
                            let availableSeats = 0;
                            if (testSlots && testSlots.length > 0) {
                                for (const testSlot of testSlots) {
                                    const slotData = {
                                        testTime: testSlot.testTime
                                    };
                                    const seats = testSlot?.testSeat;
                                    if (seats && seats.length > 0) {
                                        for (const seatData of seats) {
                                            if (seatData.seatStatus === 1 && seatData.optStatus === 1) {
                                                availableSeats += 1;
                                                tests.push({
                                                    ...cityData,
                                                    ...slotData,
                                                    seatId: seatData.seatId,
                                                    centerCode: seatData.centerCode,
                                                    centerName: seatData.centerName,
                                                    levelCode: seatData.levelCode,
                                                    writtenType: seatData.writtenType,
                                                    speakType: seatData.speakType
                                                })
                                            }
                                        }
                                    }
                                }
                            }
                            console.log("%s在%s有%d个考位", name, date, availableSeats);
                            await this.sleep(100);
                        }
                    }
                    this.fetching = false;
                    return tests;
                },
            },
            watch: {
                selectedProductCode(newProduct, oldProduct) {
                    if (newProduct) {
                        console.log("Change product from %s to %s", oldProduct, newProduct);
                        this.initLoading();
                        this.cites.splice(0);
                        this.selectedCites.splice(0);
                        if (newProduct) {
                            $.getJSON("getTestCenterProvinceCity", {
                                productCode: newProduct
                            }, (data) => {
                                const returnCities = [];
                                for (const province of data) {
                                    const cities = province['cities'];
                                    for (const city of cities) {
                                        returnCities.push({
                                            'name': province['provinceNameCn'] + ' - ' + city['cityNameCn'],
                                            'value': city['cityCode']
                                        });
                                    }
                                }
                                console.log("cities updated", returnCities);
                                this.cites = returnCities;
                                this.closeLoading();
                            });
                        }
                    }
                },
            }
        });
    }

    main();
})();