function Processor(n, t, b, p) {
    this.name = parseInt(n, 10);
    this.arrivalTime = parseInt(t, 10);
    this.burstTime = parseInt(b, 10);
    this.priority = parseInt(p, 10);
    this.wTime = 0;
    this.tTime = 0;
    this.display = function() {
        console.log(`${this.name} ${this.burstTime} ${this.priority}`);
        console.log(`${this.waitingTime} ${this.turnAroundTime}`);
    }
}

var app = new Vue({
    el: '#app',
    data: {
        message: 'Hello Vue!',
        data: '',
        FCFS: '',
        FCFSAccuWTime: 0,
        FCFSAccuTTime: 0,
        FCFSAveWTime: 0,
        FCFSAveTTime: 0,
        SJF: '',
        sortedSJF: '',
        SJFAccuWTime: 0,
        SJFAccuTTime: 0,
        SJFAveWTime: 0,
        SJFAveTTime: 0,
        SRPT: '',
        SRPTAccuWTime: 0,
        SRPTAccuTTime: 0,
        SRPTAveWTime: 0,
        SRPTAveTTime: 0,
        SRPTChart: [],
        SPRTtime: 0,
        nonPreSRPT: '',
        nonPreSRPTAccuWTime: 0,
        nonPreSRPTAccuTTime: 0,
        nonPreSRPTAveWTime: 0,
        nonPreSRPTAveTTime: 0,
        nonPreSRPTChart: [],
        nonPreSPRTTime: 0,
        prioritySJF: '',
        sortedPrioritySJF: '',
        prioSJFAccuWTime: 0,
        prioSJFAccuTTime: 0,
        prioSJFAveWTime: 0,
        prioSJFAveTTime: 0,
        priorityFCFS: '',
        sortedPriorityFCFS: '',
        prioFCFSAccuWTime: 0,
        prioFCFSAccuTTime: 0,
        prioFCFSAveWTime: 0,
        prioFCFSAveTTime: 0,
        roundRobin: '',
        sortedrRobin: '',
        rrobinChart: '',
        rrobinAccuWTime: 0,
        rrobinAccuTTime: 0,
        rrobinAveWTime: 0,
        rrobinAveTTime: 0,
    },
    methods: {
        run: function() {
            this.runFCFS();
            this.runSJF();
            this.runSRPT();
            this.runPriority();
            this.runRoundRobin();
        },
        runFCFS: function() {
            this.FCFS = JSON.parse(JSON.stringify(this.data));
            var wTime = 0;
            var tTime = 0;
            this.FCFSAccuWTime = 0;
            this.FCFSAccuTTime = 0;
            for (var i = 0; i < this.FCFS.length; i++) {
                tTime += this.FCFS[i].burstTime;
                this.FCFS[i].wTime = wTime;
                this.FCFSAccuWTime += wTime;
                this.FCFS[i].tTime = tTime;
                this.FCFSAccuTTime += tTime;
                wTime = tTime;
            }
            this.FCFSAveWTime = this.FCFSAccuWTime / this.FCFS.length;
            this.FCFSAveTTime = this.FCFSAccuTTime / this.FCFS.length;
        },
        runSJF: function() {
            this.SJF = JSON.parse(JSON.stringify(this.data));
            this.SJF.sort(this.sortByBurstTime);
            var wTime = 0;
            var tTime = 0;
            this.SJFAccuWTime = 0;
            this.SJFAccuTTime = 0;
            for (var i = 0; i < this.SJF.length; i++) {
                tTime += this.SJF[i].burstTime;
                this.SJF[i].wTime = wTime;
                this.SJFAccuWTime += wTime;
                this.SJF[i].tTime = tTime;
                this.SJFAccuTTime += tTime;
                wTime = tTime;
            };
            this.SJFAveWTime = this.SJFAccuWTime / this.SJF.length;
            this.SJFAveTTime = this.SJFAccuTTime / this.SJF.length;
            this.sortedSJF = JSON.parse(JSON.stringify(this.SJF));
            this.sortedSJF.sort(this.sortByName);
        },
        runSRPT: function() {
            // Preemptive
            this.SRPT = JSON.parse(JSON.stringify(this.data));
            var copySRPT = JSON.parse(JSON.stringify(this.data));
            copySRPT.sort(this.sortByArrivalTime);
            this.SRPTChart = [];
            var arrivedArr = [];
            for (; arrivedArr.length || copySRPT.length;) {
                var processor = this.chooseProcessor(copySRPT, arrivedArr, this.SPRTtime, true);
                this.SRPTChart.push(processor);
            };
            this.SRPTAveTTime = this.SRPTAccuTTime / this.SRPT.length;
            this.SRPTAveWTime = this.SRPTAccuWTime / this.SRPT.length;

            // Non Preemptive
            this.nonPreSRPT = JSON.parse(JSON.stringify(this.data));;
            var copyNonPreSRPT = JSON.parse(JSON.stringify(this.data));;
            copyNonPreSRPT.sort(this.sortByArrivalTime);
            this.nonPreSRPTChart = [];
            arrivedArr = [];
            for (; arrivedArr.length || copyNonPreSRPT.length;) {
                var processor = this.chooseProcessor(copyNonPreSRPT, arrivedArr, this.nonPreSPRTTime, false);
                this.nonPreSRPTChart.push(processor);
            };
            this.nonPreSRPTAveTTime = this.nonPreSRPTAccuTTime / this.nonPreSRPT.length;
            this.nonPreSRPTAveWTime = this.nonPreSRPTAccuWTime / this.nonPreSRPT.length;
        },
        runPriority: function() {
            // SJF
            this.prioritySJF = JSON.parse(JSON.stringify(this.data));
            this.prioritySJF.sort(this.sortByBurstTime);
            this.bubbleSort(this.prioritySJF);

            // this.prioritySJF.sort(this.sortByPriority);
            var wTime = 0;
            var tTime = 0;
            this.prioSJFAccuWTime = 0;
            this.prioSJFAccuTTime = 0;
            for (var i = 0; i < this.prioritySJF.length; i++) {
                tTime += this.prioritySJF[i].burstTime;
                this.prioritySJF[i].wTime = wTime;
                this.prioSJFAccuWTime += wTime;
                this.prioritySJF[i].tTime = tTime;
                this.prioSJFAccuTTime += tTime;
                wTime = tTime;
            }
            this.prioSJFAveWTime = this.prioSJFAccuWTime / this.prioritySJF.length;
            this.prioSJFAveTTime = this.prioSJFAccuTTime / this.prioritySJF.length;
            this.sortedPrioritySJF = JSON.parse(JSON.stringify(this.prioritySJF));
            this.sortedPrioritySJF.sort(this.sortByName);

            // FCFS
            this.priorityFCFS = JSON.parse(JSON.stringify(this.data));
            // this.priorityFCFS.sort(this.sortByNameReverse);
            console.log(JSON.stringify(this.priorityFCFS));
            // this.priorityFCFS.sort(this.sortByPriority);
            this.bubbleSort(this.priorityFCFS);
            console.log(JSON.stringify(this.priorityFCFS));
            var wTime = 0;
            var tTime = 0;
            this.prioFCFSAccuWTime = 0;
            this.prioFCFSAccuTTime = 0;
            for (var i = 0; i < this.priorityFCFS.length; i++) {
                tTime += this.priorityFCFS[i].burstTime;
                this.priorityFCFS[i].wTime = wTime;
                this.prioFCFSAccuWTime += wTime;
                this.priorityFCFS[i].tTime = tTime;
                this.prioFCFSAccuTTime += tTime;
                wTime = tTime;
            }
            this.prioFCFSAveWTime = this.prioFCFSAccuWTime / this.priorityFCFS.length;
            this.prioFCFSAveTTime = this.prioFCFSAccuTTime / this.priorityFCFS.length;
            this.sortedPriorityFCFS = JSON.parse(JSON.stringify(this.priorityFCFS));
            this.sortedPriorityFCFS.sort(this.sortByName);
        },
        runRoundRobin: function() {
            this.roundRobin = JSON.parse(JSON.stringify(this.data));
            this.sortedrRobin = JSON.parse(JSON.stringify(this.data));
            this.rrobinChart = [];
            for (var i = 0, t = 0; this.roundRobin.length;) {
                this.rrobinChart.push(this.roundRobin[i].name);
                if (this.roundRobin[i].burstTime <= 4) {
                    t += this.roundRobin[i].burstTime;
                    var p = this.roundRobin[i].name;
                    var obj = this.sortedrRobin.find(obj => obj.name == p);
                    obj.wTime = t - (obj.burstTime);
                    obj.tTime = t;
                    this.rrobinAccuWTime += obj.wTime;
                    this.rrobinAccuTTime += obj.tTime;
                    this.roundRobin.splice(i, 1);
                    i--;
                } else {
                    this.roundRobin[i].burstTime -= 4;
                    t += 4;
                }
                i++;
                if (i == this.roundRobin.length) {
                    i = 0;
                }
            }
            this.rrobinAveWTime = this.rrobinAccuWTime / this.sortedrRobin.length;
            this.rrobinAveTTime = this.rrobinAccuTTime / this.sortedrRobin.length;
            this.sortedrRobin.sort(this.sortByName);
        },
        chooseProcessor: function(a, b, t, preemptive) {
            this.updateArrived(a, b, t);
            return this.leastBurstTime(b, t, preemptive);
        },
        updateArrived: function(a, b, t) {
            a.sort(this.sortByArrivalTime);
            for (var i = 0; i < a.length; i++) {
                if (a[i].arrivalTime <= t) {
                    b.push(a[i]);
                    a.splice(i, 1);
                    i--;
                } else {
                    break;
                }
            }
        },
        leastBurstTime: function(b, t, preemptive) {
            b.sort(this.sortByBurstTime);
            var p = b[0].name;
            if (preemptive) {
                b[0].burstTime--;
                this.SPRTtime++;
            } else {
                this.nonPreSPRTTime += b[0].burstTime;
                b[0].burstTime = 0;
            }
            if (b[0].burstTime == 0) {
                b.shift();
                var obj;
                if (preemptive) {
                    t = this.SPRTtime;
                    obj = this.SRPT.find(obj => obj.name == p);
                } else {
                    t = this.nonPreSPRTTime;
                    obj = this.nonPreSRPT.find(obj => obj.name == p);
                }
                obj.wTime = (t - (obj.arrivalTime + obj.burstTime));
                obj.tTime = t;
                if (preemptive) {
                    this.SRPTAccuWTime += obj.wTime;
                    this.SRPTAccuTTime += obj.tTime;
                } else {
                    this.nonPreSRPTAccuWTime += obj.wTime;
                    this.nonPreSRPTAccuTTime += obj.tTime;
                }
            }
            return p;
        },
        sortByName: function(a, b) {
            return a.name - b.name;
        },
        sortByNameReverse: function(a, b) {
            return b.name - a.name;
        },

        bubbleSort: function(arr) {
            var len = arr.length;
            for (var i = len - 1; i >= 0; i--) {
                for (var j = 1; j <= i; j++) {
                    if (arr[j - 1].priority > arr[j].priority) {
                        var temp = arr[j - 1];
                        arr[j - 1] = arr[j];
                        arr[j] = temp;
                    }
                }
            }
            return arr;
        },
        sortByBurstTime: function(a, b) {
            return a.burstTime - b.burstTime;
        },
        sortByPriority: function(a, b) {
            if (a.priority > b.priority) {
                return 1;
            }
            if (a.priority < b.priority) {
                return -1;
            }
            return 0;
        },
        sortByArrivalTime: function(a, b) {
            return a.arrivalTime - b.arrivalTime;
        }
    }
});

document.addEventListener("DOMContentLoaded", function() {
    // This is for input file reading
    var input = document.getElementById("myFile");
    var output = document.getElementById("output");

    input.addEventListener("change", function() {
        if (this.files && this.files[0]) {
            var myFile = this.files[0];
            var reader = new FileReader();

            reader.addEventListener('load', function(e) {
                var file = e.target.result;
                var fields = file.split(",");
                var data = [];
                for (var i = 4; i < fields.length; i += 4) {
                    data.push(new Processor(
                        fields[i], fields[i + 1], fields[i + 2], fields[i + 3]
                    ));
                }
                app.data = data.slice(0);
                app.run();
            });
            reader.readAsBinaryString(myFile);
        }
    });
});