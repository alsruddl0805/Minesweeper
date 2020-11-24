// 변수 밖으로 뺀 이유 = SCOPE
var tbody = document.querySelector("#table tbody");
var dataset = [];

document.querySelector("#exec").addEventListener('click',function(){
    // 내부 먼저 초기화 후 시작
    tbody.innerHTML = "";
    dataset = [];

    var hor = parseInt(document.querySelector("#hor").value);
    var ver = parseInt(document.querySelector("#ver").value);
    var mine = parseInt(document.querySelector("#mine").value);
    console.log(hor,ver,mine);

    // 지뢰 위치 뽑기 시작
    var mines = Array(hor * ver).fill() // 칸의 개수를 undefined로 채움 
    .map(function(item,index){ // map = 1:1로 짝지어주는 과정
        return index; // 0-99 추출
    });

    var shuffle = []; // 피셔예이츠 셔플로 지뢰심을 개수 위치를 뽑음
    while(mines.length>80) {
        var move = mines.splice(Math.floor(Math.random()*mines.length),1)[0];
        shuffle.push(move);
    }
    console.log(shuffle);

    // 지뢰 기본 틀 만들기
    for(var i=0; i<ver; i+=1) { // tr(세로)를 먼저 만들어야 td(가로)를 넣을 수 있다.
        var arr = [];
        var tr = document.createElement('tr');
        dataset.push(arr);
        for(var j=0; j<hor; j+=1) {
            arr.push(0);
            var td = document.createElement('td');
            td.addEventListener('contextmenu',function(e){
                e.preventDefault();
                // console.log('오른쪽 클릭');
                var parentTR = e.currentTarget.parentNode;
                var parentTBODY = e.currentTarget.parentNode.parentNode;
                var box = Array.prototype.indexOf.call(parentTR.children,e.currentTarget); // 배열이 아닌것들에게도 indexOf 사용 가능
                var line = Array.prototype.indexOf.call(parentTBODY.children,parentTR);
                // console.log(parentTR,parentTBODY,box,line);
                if (e.currentTarget.textContent == '' || e.currentTarget.textContent == 'X') {
                    e.currentTarget.textContent = "!";
                } else if (e.currentTarget.textContent == '!') {
                    e.currentTarget.textContent = "?";
                } else if (e.currentTarget.textContent == '?') {
                    if (dataset[line][box] == 1) {
                        e.currentTarget.textContent = "";
                    } else if (dataset[line][box] == "X") {
                        e.currentTarget.textContent = "X";
                    }
                }
            });
            td.addEventListener('click',function(e){
                var parentTR = e.currentTarget.parentNode;
                var parentTBODY = e.currentTarget.parentNode.parentNode;
                var box = Array.prototype.indexOf.call(parentTR.children,e.currentTarget); // 배열이 아닌것들에게도 indexOf 사용 가능
                var line = Array.prototype.indexOf.call(parentTBODY.children,parentTR);
                e.currentTarget.classList.add('opened');
                dataset[line][box] = 1; // 기본 0인것을 주변칸을 열때는 1로 바꿈
                if (dataset[line][box] == "X") {
                    e.currentTarget.textContent = "펑!";
                } else {
                    // 주변 지뢰 찾기 후 개수표시
                    var nearMine = [dataset[line][box-1],dataset[line][box+1],];
                    
                    if (dataset[line-1]) {
                        nearMine = nearMine.concat(dataset[line-1][box-1],dataset[line-1][box],dataset[line-1][box+1]);
                    } 
                    if (dataset[line+1]) {
                        nearMine = nearMine.concat(dataset[line+1][box-1],dataset[line+1][box],dataset[line+1][box+1]);
                    }
                    // console.log(nearMine);
                    var nearMineCnt = nearMine.filter(function(v){
                        return v == "X";
                    }).length;
                    e.currentTarget.textContent = nearMineCnt;
                    if (nearMineCnt == 0) {
                        // 지뢰 주변 8칸 동시 오픈 (재귀함수 사용) 
                        var nearBox = [];
                        if (tbody.children[line-1]) {
                            nearBox = nearBox.concat([
                                tbody.children[line-1].children[box-1],
                                tbody.children[line-1].children[box],
                                tbody.children[line-1].children[box+1]
                            ]);
                        }
                        nearBox = nearBox.concat([
                            tbody.children[line].children[box-1],
                            tbody.children[line].children[box+1]
                        ]);
                        if (tbody.children[line+1]) {
                            nearBox = nearBox.concat([
                                tbody.children[line+1].children[box-1],
                                tbody.children[line+1].children[box],
                                tbody.children[line+1].children[box+1]
                            ]);
                        }
                        // 배열에서 undefined,null,빈문자열을 제거하는 코드
                        nearBox.filter(function(v){
                            return !!v;
                        }).forEach(function(sideBox){
                            var parentTR = e.currentTarget.parentNode;
                            var parentTBODY = e.currentTarget.parentNode.parentNode;
                            var sideBoxBox = Array.prototype.indexOf.call(parentTR.children,e.currentTarget); // 배열이 아닌것들에게도 indexOf 사용 가능
                            var sideBoxLine = Array.prototype.indexOf.call(parentTBODY.children,parentTR);
                            if (dataset[sideBoxBox][sideBoxLine] != 1) {
                               sideBox.click();
                            }
                        }); 
                    }
                }
            });
            tr.appendChild(td);
            // td.textContent = 1;
        }
        tbody.appendChild(tr);
    } 
    // console.log(dataset);

    // 지뢰 심기
    for (var k=0; k<shuffle.length; k++) { // ex) 랜덤값 = 60 일때
        var verMine = Math.floor(shuffle[k] / 10) ; // ex) 7 -> 6
        var horMine = shuffle[k] % 10; // ex) 0 -> 0
        console.log(verMine,horMine);
        tbody.children[verMine].children[horMine].textContent = "X";
        dataset[verMine][horMine] = "X";
    }
});

// currentTarget & target 차이
// tbody.addEventListener('contextmenu',function(e){
//     console.log('currentTarget',e.currentTarget);
//     // currentTarget => eventlistener가 달린 대상 (tbody에 달렸기 때문에 tbody부터 출력)
//     console.log('target',e.target);
//     // target => 실제 event가 발생한 대상
// });

// 재귀함수 알아보기 - 반복문의 역할 가능
// function 재귀함수(숫자) {
//     console.log(숫자);
//     if (숫자<5) { // 제한을 두어야 한다
//         재귀함수(숫자+1);
//     }
// }
// 재귀함수(1);
// *stepoverflow : 재귀함수가 너무 많이 무한반복이 되면 에러나는 사항 