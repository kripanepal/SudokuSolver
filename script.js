var matrix = new Array(9);
var current = true
var currentTarget
var matrix2 = new Array(9);
var currentLevel = 37;
var test = true;
createMatrices();
function createMatrices() {
  for (var i = 0; i < 9; i++) {
    matrix[i] = new Array(9);
    matrix2[i] = new Array(9);
  }
}

var done = false;
createInitialtable(currentLevel);

function createInitialtable(currentLevel) {
  done = false;

  var table = document.createElement("table");
  table.setAttribute("border", 1);

  table.setAttribute("id", "table");
  document.getElementById("mainDiv").appendChild(table);
  var locSet = new Set();

  randTimes = Math.floor(Math.random() * currentLevel);

  while (randTimes < currentLevel - 2) {
    randTimes = Math.floor(Math.random() * currentLevel);
  }

  for (i = 0; i < randTimes; i++) {
    randRow = Math.floor(Math.random() * 9);
    randCol = Math.floor(Math.random() * 9);

    tr = document.createElement("tr");
    tr.setAttribute("id", "row" + randRow);
    locSet.add(randRow + "" + randCol);
  }

  for (var row = 0; row < 9; row++) {
    tr = document.createElement("tr");
    tr.setAttribute("id", "row" + i);

    for (var cell = 0; cell < 9; cell++) {
      matrix[row][cell] = "$";
      matrix2[row][cell] = "$";

      td = document.createElement("td");
      ta = document.createElement("input");
      ta.setAttribute("id", "cell" + row + "" + cell);
      //td.setAttribute("id", "cell" + row + "" + cell);
      ta.setAttribute("size", "1");
      ta.setAttribute("class", "each");
      ta.setAttribute("type", "number");
      ta.setAttribute("min", "1");
      ta.setAttribute("max", "9");
      ta.setAttribute("class", "ta");
      ta.setAttribute("onclick", "highLight()");
      //ta.setAttribute("onmouseout", "removeColor()");

      if (locSet.has(row + "" + cell)) {
        randNum = Math.floor(Math.random() * 9 + 1);
        if (check(row, cell, randNum, "main")) {
          //td.value = randNum;
          ta.value = randNum;
          matrix[row][cell] = randNum;
          matrix2[row][cell] = randNum;

          //td.setAttribute("class", "notEditable");
          ta.setAttribute("class", "notEditable");
          locSet.delete(row + "" + cell);
          ta.setAttribute("readonly", "readonly");
        } else {
          //td.setAttribute("contenteditable", "true");
          ta.setAttribute("onKeyup", "assignValue(event,this)");
        }
      } else {
        //td.setAttribute("contenteditable", "true");
        //td.setAttribute("onKeyup", "assignValue(event,this)");
        // ta.setAttribute("type", "number");
        ta.setAttribute("onKeyup", "assignValue(event,this)");
        // ta.setAttribute("min", "0");
        // ta.setAttribute("max", "9");
        // ta.setAttribute("size", "2");
      }

      tr.appendChild(ta);
    }
    table.appendChild(tr);
  }
  if (solveCheck()) {
    matrix = matrix2.map(function (arr) {
      return arr.slice();
    });

    done = false;
  } else {
    var element = document.getElementById("table");
    element.parentNode.removeChild(element);
    createInitialtable(currentLevel);
  }
}

function assignValue(event, element) {
  var id = element.getAttribute("id");
  var col = id.substring(id.length - 1, id.length);
  var row = id.substring(id.length - 2, id.length - 1);

  var value = event.key;

  if (value === "Delete" || value === "Backspace" || value === "Enter") {
    matrix[row][col] = "$";
    document.getElementById("cell" + row + col).value = "";
    element.preventDefault;
  }
  if (
    isNaN(value) ||
    value == 0 ||
    document.getElementById("cell" + row + col).value.length === 2
  ) {
    document.getElementById("cell" + row + col).value = "";

    matrix[row][col] = "$";
    event.preventDefault();
    return;
  } else {
    if (check(row, col, value)) {
      matrix[row][col] = value;
    }
  }
}

function check(row, col, value, calledFrom) {
  var can = true;
  var pre = 0;
  for (i = 0; i < 9; i++) {
    if (matrix[row][i] == value) {
      if (calledFrom != "main") {
        pre = row + "" + i;
        color(row, i);
        document.getElementById("cell" + row + col).value = "";
        matrix[row][col] = "$";
      }

      can = false;
    } else if (matrix[i][col] == value) {
      if (calledFrom != "main") {
        pre = i + "" + col;
        color(i, col);
        document.getElementById("cell" + row + col).value = "";
        matrix[row][col] = "$";
      }

      can = false;
    }
  }

  var rowStart = row - (row % 3);
  var colStart = col - (col % 3);

  for (var i = rowStart; i < rowStart + 3; i++) {
    for (var j = colStart; j < colStart + 3; j++) {
      if (matrix[i][j] == value) {
        if (calledFrom != "main") {
          if (pre != i + "" + j) {
            color(i, j);
          }

          document.getElementById("cell" + row + col).value = "";
          matrix[row][col] = "$";
        }
        can = false;
      }
    }
  }
  return can;
}

async function color(i, j) {
  if (!done) {
    var element = document.getElementById("cell" + i + "" + j);
    var preColor = element.style.backgroundColor;

    element.style.backgroundColor = "red";
    setTimeout(function () {
      element.style.backgroundColor = preColor;
    }, 100);
  }
}
function solvera() {
  done = true;

  for (let row = 0; row < 9; row++) {
    for (let col = 0; col < 9; col++) {
      if (matrix[row][col] == "$") {
        for (let number = 1; number <= 9; number++) {
          if (check(row, col, number)) {
            document.getElementById("cell" + row + col).value = number;
            document
              .getElementById("cell" + row + col)
              .setAttribute("disabled", "true");

            matrix[row][col] = number;

            if (solvera()) {
              return true;
            } else {
              document.getElementById("cell" + row + col).value = "";

              matrix[row][col] = "$";
            }
          }
        }
        return false;
      }
    }
  }

  return true;
}
function aa() {
  console.log(matrix);
  console.log(matrix2);
}

function checkDone() {
  for (var i = 0; i < 9; i++) {
    for (var j = 0; j < 9; j++) {
      if (matrix[i][j] === "$") {
        return false;
      }
    }
  }

  document.getElementById("watermarkNot").style.visibility = "visible";

  for (var i = 0; i <= 8; i++) {
    for (var j = 0; j <= 8; j++) {
      document.getElementById("cell" + row + "" + col).setAttribute("disabled");
    }
  }
}

function solver() {
  matrix = matrix2.map(function (arr) {
    return arr.slice();
  });
  var temp = solvera();
  if (temp) {
    document.getElementById("watermarkNot").style.visibility = "visible";
    document.getElementsByClassName("again")[0].style.visibility = "visible";
    document.getElementsByClassName("solve")[0].style.visibility = "hidden";
    done = false;
  }
}

function solveCheck() {
  done = true;
  for (let row = 0; row < 9; row++) {
    for (let col = 0; col < 9; col++) {
      if (matrix[row][col] == "$") {
        for (let number = 1; number <= 9; number++) {
          if (check(row, col, number)) {
            matrix[row][col] = number;

            if (solveCheck()) {
              return true;
            } else {
              matrix[row][col] = "$";
            }
          }
        }
        return false;
      }
    }
  }

  return true;
}

function highLight() {

  for (var i = 0; i <= 8; i++) {
    for (var j = 0; j <= 8; j++) {
      if ((current)) {
        
        if (matrix[i][j] == event.target.value) {
          console.log(i + "" + j);
          document.getElementById("cell" + i + j).style.color = "red";
          document.getElementById("cell" + i + j).style.fontWeight = "bold";
        }
      } else {
        

        var element = document.getElementById("cell" + i + j);
        if (element.getAttribute("class") != "notEditable") {
          document.getElementById("cell" + i + j).style.color = "black";
        } else {
          document.getElementById("cell" + i + j).style.color = "blue";
        }
      }
    }
  }
  current = !current;
}

function removeColor() {}
