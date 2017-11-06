window.board = '';

function Square(variable, domain, ind, row, col, box, neighbors, constraints) {
  //Define each square
  this.variable = variable;
  this.domain = domain;
  this.ind = ind;
  this.constraints = constraints;
  this.row = row;
  this.neighbors = neighbors;
  this.col = col;
  this.box = box;
}

let AC3 = (CSP) => {
  //init the ac3 algorithm
  let queue = []; //empty queue
    document.querySelector("#log").innerHTML = "";
  console.log("initialze AC3");
  document.querySelector("#log").innerHTML += "Init Ac3 with board";
  CSP.forEach(square => { //fill queue with all constraints
    square.constraints.forEach(x => {
      queue.push(x);
    });
  });
  console.log("Queue length: ", queue.length);
          document.querySelector("#log").innerHTML += "<br> AC3 has queue of " + queue.length;

  let full;
  let X, Y, c;
  while (queue.length > 0) {
    temp = queue.shift(); //get next square in queue
    X = temp[0], Y = temp[1]; //X is consistent to Y if x != y
    if (removeDom(X, Y)) { //if there is a conflict between X and Y
      if (X.domain.length < 1) {console.log("No solution exists - domain empty"); return X;} //no sol
      // X.neighbors.splice(X.neighbors.indexOf(Y), 1); //remove Y from neighbor list
      X.neighbors.forEach(neigh => {
        queue.push([neigh, X]); //add all neighbors as a constraint to queue
      });
    }
    console.log("Queue length: ", queue.length);
  }
  if(queue.length !== 0) {
    document.querySelector("#log").innerHTML += "<br> CSP not solved. Sorry ";
    return false;
  }
  if (isTested(CSP)) { //if CSP is complete
    CSP.forEach(sq => {
      sq.variable = sq.domain[0]; //variable is for sure the domain value now
    });
            document.querySelector("#log").innerHTML += "<br> Solved with AC3 only. ";

  } else { //not complete csp
      console.log("CSP not completely solved: using Backtracking" );
      document.querySelector("#log").innerHTML += "<br> CSP not completely solved: using Backtracking ";

    bt(CSP); //start backtracking
  }
  return CSP; //return finalized CSP
};

let removeDom = (X, Y, con) => {
  let changed = false,
    index;
  X.domain.forEach(x => { //for each value in the domain of X
    if (Y.domain.indexOf(x) > -1 && Y.domain.length === 1) { //check if it is consistent for all values in the domain of Y
      index = X.domain.indexOf(x);
      X.domain.splice(index, 1); //remove the D(x) value, since its not consistent
      changed = true; //tell algo that its been changed.
    }
  });
  return changed;
};

let defineCons = (matrix, value) => { //create cons for a square
  matrix
    .filter(square => (square.row === value.row || square.col === value.col || square.box === value.box) && square !== value) //get only squares that are actually neighbours
    .forEach(x => { //for each square that is valid add it as a constraint
      value.constraints.push([value, x]);
      value.neighbors.push(x); //also add it as neighbour
    });
};

let buildCons = (matrix) => { //find all constraints for all squares
  matrix.forEach((val, i) => {
    defineCons(matrix, val);
  });
  return matrix;
};

let buildBoard = (board) => { //define a matrix used in CSP from a string
//takes in string that represents a board
  let arr = [],
    all = [],
    temp,
    domain = 0,
    i = 0,
    box,
    r, c,
    square;
  
  board = board.replace(/\s/g, '');
  //define all requirments for the board (technically can be a bigger board)
  let MAX = Math.sqrt(board.length),
    ROW = MAX,
    BOX = Math.sqrt(MAX),
    COL = MAX;
  window.matrix = [];

  for (let row = 0; row < ROW; row++) {
    for (let col = 0; col < COL; col++) {
      // loop through in a nested loop so we can define col and row easily
      square = +board[i]; //variable of square
      square === 0 ? domain = Array(MAX).fill().map((e, i) => i + 1) : domain = [square]; //set domain either as list [1-9] or as the variable
      r = (Math.floor(row / BOX) * BOX); //find row of sq
      c = (Math.floor(col / BOX) * BOX); //col of sq
      box = r + "" + c; //which box it is in (top left coord)
      temp = new Square(square, domain, i, row, col, box, [], []);
      arr.push(temp); //add it to the new matrix
      i++;
    }
  }
  return arr;
};

let isSolved = (board) => {
  let temp = true;
  board.forEach(square => { //for all squares
    square.constraints.forEach(con => { //for all constraints of sq
      if (con[1].variable === con[0].variable) { //check if current value of sq is in constraints, if so, then set flag as false
        temp = false;
      }
    });
  });
  if (temp) {
    console.log("is Solved");
  }
  return temp;
};

let isTested = (board) => {
  let temp = true;
  board.forEach(square => { //for all squares
    if (square.domain.length !== 1) { //check if ac3 has solved all domains
      temp = false;
    }
  });
  if (temp) {
    console.log("is Solved");
  }
  return temp;
};

let bt = (csp) => { //start recursive bt
  
  let isCon = (curr, newv) => { // check if consinstent before setting variable
    let temp = true;
    curr.constraints.forEach(pair => {
      if (pair[1].variable === newv) temp = false; //the value is not consistent
    });
    return temp;
  };

  let _b = (board) => { //inner recursive function
    if (isSolved(board)) { //if solved, then we are done
      return true;
    } else {
      let nextNode = csp.find((sq) => { //get next node that has no defined variable
        return sq.variable === 0;
      });
      for (let m = 0; m < nextNode.domain.length; m++) { //for all values in D(x)
        if (isCon(nextNode, nextNode.domain[m])) { //test if D(x) is a consistent value
          nextNode.variable = nextNode.domain[m]; //if it is, set current node's variable as current D(x)
          if (_b(board)) return true; //if the board is complete, we're done
          nextNode.variable = 0; //otherwise, reset variable
        }
      }
    }
    return false; //no sol w/ curr variable
  }
    console.log("Init BT with: ", csp);
    document.querySelector("#log").innerHTML += "<br> Backtrack starts ";

  _b(csp);
  
      document.querySelector("#log").innerHTML += "<br> Backtrack ends ";

}


let printBoard = board => {
  let b = document.getElementById("sol");
  b.innerHTML = '';
  let x, s, d;
  board.forEach((sq, i) => {
    x = document.createElement("div");
    x.className = "sq";
    x.className += sq.row % 3 === 0 ? ' row' : ' ';
    x.className += sq.col % 3 === 0 ? ' col' : ' ';
    s = document.createElement("input");
    s.type = "text";
    s.value = sq.variable;
    // d = document.createTextNode(sq.variable);
    // s.appendChild(d);
    x.appendChild(s);
    b.appendChild(x);
  });
};

