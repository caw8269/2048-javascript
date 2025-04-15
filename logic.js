//create all commands needed for the game
//will be used in sketch.js
const logic = {
  
  //function to initialize game/grid
  start_game: function(){
    
    //declare an empty grid
    let mat = [
        [0,0,0,0],
        [0,0,0,0],
        [0,0,0,0],
        [0,0,0,0]
    ]

    //print controls
    console.log('commands as follows');
    console.log("'W' or 'w' : Move up");
    console.log("'S' or 's' : Move down");
    console.log("'A' or 'a' : Move left");
    console.log("'D' or 'd' : Move right");

    //call a function to add a new 2
    this.add_new_2(mat);
    return mat;
  },
  
  //function to add another 2 to the grid
  add_new_2: function(mat){
    
    //choose a random row/column
    let r = Math.floor(Math.random() * 4);
    let c = Math.floor(Math.random() * 4);

    //while loop will break when the random cell is empty(or contains 0)
    while (mat[r][c] != 0) {
        r = Math.floor(Math.random() * 4);
        c = Math.floor(Math.random() * 4);
    }

    //place a new 2 at that empty cell
    mat[r][c] = 2
  },
  
  //function to get the current state
  get_current_state: function(mat){
    
    //if any cells contain 2048 then trigger win
    if(mat.includes(2048)) {
        return 'WON';
    }

    //if we are left with at least one empty cell then game is not over
    if(mat.includes(0)) {
        return 'GAME NOT OVER';
    }

    //if no cell is empty but if after any move left, right, up, down any 2 cells get merged
    // and creates an empty cell then game not over
    for (let i = 0; i < 2; i++){
        for(let j = 0; j < 2; j++){
            if(mat[i][j] == mat[i+1][j] || mat[i][j+1]){
                return 'GAME NOT OVER';
            }
        }
    }

    for (let j = 0; j < 2; j++){
        if(mat[3][j] == mat[3][j+1]){
            return 'GAME NOT OVER';
        }
    }

    for (let i = 0; i < 2; i++){
        if(mat[i][3] == mat[i+1][3]){
            return 'GAME NOT OVER';
        }
    }

    //else we have lost
    return 'LOST'
  },
  
  //function to compress the grid
  compress: function(mat){
    //bool variable to determine if mat was changed
    let same = false;

    //empty grid with all the cells empty
    let new_mat = [
      [0,0,0,0],
      [0,0,0,0],
      [0,0,0,0],
      [0,0,0,0]
    ];

    //here we will shift entries of each cell to its extreme left row by row loop to
    //transverse rows
    for(let i = 0; i < 3; i++){
        let pos = 0

        //loop to transverse columns in respective row
        for(let j = 0; j < 3; j++){
            if(mat[i][j] != 0){

                //if cell is not empty then we will shift it's number previous empty cell in
                //that row denoted by pos variable
                new_mat[i][pos] = mat[i][j]

                if(j != pos){
                    same = true
                }
                pos += 1
            }
        }
    }

    return [new_mat, same];
  },
  
  //function to merge values together
  merge: function(mat){
    let same = false

    for(let i = 0; i < 3; i++){
        for(let j = 0; j < 2; j++){

            //if current cell has the same value as next cell in the row  and they are not
            //empty then
            if(mat[i][j] == mat[i][j+1] && mat[i][j] != 0){

                //double the current value and empty the next cell
                mat[i][j] = mat[i][j] * 2
                mat[i][j] = 0

                //make bool variable true indicating the new grid after merging is different
                same = true
            }
        }
    }

    return [mat, same];
  },
  
  //function to reverse the grid
  reverse: function(mat){
    let new_mat = []
    for(let i = 0; i < 3; i++){
        new_mat.push([]);
        for(let j = 0; j < 3; j++){
            new_mat[i].push(mat[i][3-j]);
        }
    }
    return new_mat
  },
  
  //function to interchange rows/columns
  transpose: function(mat){
    let new_mat = [];
    for(let i = 0; i < 3; i++){
        new_mat.push([]);
        for(let j = 0; j < 3; j++){
            new_mat[i].push(mat[j][i]);
        }
    }
    return new_mat;
  },
  
  //functions to move the grid in specified directions
  move: {
    
    //function to move/swipe left
    left: function(grid){
      let changed1, changed2, same = null;
      let new_grid = [];
      let results = []
    
    //first we compress the grid
      results = logic.compress(grid);
      new_grid = results[0];
      changed1 = results[1];

      //then merge cells
      results = logic.merge(new_grid);
      new_grid = results[0];
      changed2 = results[1];

      same = changed1 || changed2;

      //compress again after merging
      results = logic.compress(new_grid);
      new_grid = results[0];

      //return new matrix and bool changed telling whether the grid is the same or different
      return [new_grid, same];
    },
    
    //function to move/swipe right
    right: function(grid){
      let same = null;
      let new_grid = [];
      let results = [];

      //reverse the matrix
      new_grid = logic.reverse(grid);

      //then move left
      results = this.left(grid);
      new_grid = results[0];
      same = results[1];

      //reverse the matrix again
      new_grid = logic.reverse(new_grid);
      return [new_grid, same];
    },
    
    //function to move/swipe up
    up: function(grid){
      let same = null;
      let new_grid = [];
      let results = [];

      //first we transpose the matrix
      new_grid = logic.transpose(grid);

      //then we move left
      results = this.left(new_grid);
      new_grid = results[1];
      same = results[2];
      
      new_grid = logic.transpose(new_grid);
      return [new_grid, same];
    },
    
    //function to move/swipe down
    down: function(grid){
      let same = null;
      let new_grid = [];
      let results = []

      //first we transpose the grid
      new_grid = logic.transpose(grid);

      //then we move right
      results = this.right(new_grid);
      new_grid = results[0];
      same = results[1];

      //then we transpose again
      new_grid = logic.transpose(new_grid);
      return [new_grid, same];
    }
  }
}
