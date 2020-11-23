document.querySelector("#exec").addEventListener('click',function(){
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
    var dataset = [];
    var tbody = document.querySelector("#table tbody");
    for(var i=0; i<ver; i+=1) { // tr(세로)를 먼저 만들어야 td(가로)를 넣을 수 있다.
        var arr = [];
        var tr = document.createElement('tr');
        dataset.push(arr);
        for(var j=0; j<hor; j+=1) {
            arr.push(1);
            var td = document.createElement('td');
            tr.appendChild(td);
            // td.textContent = 1;
        }
        tbody.appendChild(tr);
    } 
    console.log(dataset);

    // 지뢰 심기
    for (var k=0; k<shuffle.length; k++) { // ex) 랜덤값 = 60 일때
        var verMine = Math.floor(shuffle[k] / 10) ; // ex) 7 -> 6
        var horMine = shuffle[k] % 10; // ex) 0 -> 0
        console.log(verMine,horMine);
        tbody.children[verMine].children[horMine].textContent = "X";
        dataset[verMine][horMine] = "X";
    }
});
