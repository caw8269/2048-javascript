//logic.js to be import into index.js file

//function to initialize game/grid at the start of the game
function start_game() {

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
    add_new_2(mat);
    return mat;
};

//function to add a new 2 to the array
function add_new_2(mat) {

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
};

//function to get the current state
function get_current_state(mat) {

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
}

//all functions below  are for left swap initially

//function to compress the grid after step before and after merging cells
function compress(mat) {
    //bool variable to determine if mat was changed
    let changed = false;

    //empty grid
    let new_mat = [];

    //with all the cells empty
    for(let i = 0; i < 3; i++){
        new_mat.push([0]*4);
    }

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
                    changed = true
                }
                pos += 1
            }
        }
    }

    return new_mat, changed;
}

//function to merge cells in matrix after compressing
function merge(mat) {
    let changed = false

    for(let i = 0; i < 3; i++){
        for(let j = 0; j < 2; j++){

            //if current cell has the same value as next cell in the row  and they are not
            //empty then
            if(mat[i][j] == mat[i][j+1] && mat[i][j] != 0){

                //double the current value and empty the next cell
                mat[i][j] = mat[i][j] * 2
                mat[i][j] = 0

                //make bool variable true indicating the new grid after merging is different
                changed = true
            }
        }
    }

    return new_mat, changed
}

//function to reverse the matrix  reversing the content of each row (reversing the sequence)
function reverse(mat){
    let new_mat = []
    for(let i = 0; i < 3; i++){
        new_mat.push([]);
        for(let j = 0; j < 3; j++){
            new_mat[i].push(mat[i][3-j]);
        }
    }
    return new_mat
}

//function to interchange the rows and columns
function transpose(mat){
    let new_mat = [];
    for(let i = 0; i < 3; i++){
        new_mat.push([]);
        for(let j = 0; j < 3; j++){
            new_mat[i].push(mat[j][i]);
        }
    }
    return new_mat;
}

//functions to update the matrix

//function to move/swipe left
function move_left(mat){
    let changed1, changed2, changed = null;
    let new_grid = [];
    
    //first we compress the grid
    new_grid, changed1 = compress(mat);

    //then merge cells
    new_grid, changed2 = merge(new_grid);

    changed = changed1 || changed2;

    //compress again after merging
    new_grid, temp = compress(new_grid);

    //return new matrix and bool changed telling whether the grid is the same or different
    return new_grid, changed
}

//function to move/swipe right
function move_right(grid){
    let changed = null;
    let new_grid = [];

    //reverse the matrix
    new_grid = reverse(grid);

    //then move left
    new_grid, changed = move_left(grid);

    //reverse the matrix again
    new_grid = reverse(new_grid);
}

//function to move/swipe up
function move_up(grid){
    let changed = null;
    let new_grid = [];

    //first we transpose the matrix
    new_grid = transpose(grid);

    //then we move left
    new_grid, changed = move_left(new_grid);
    return new_grid, changed;
}

//function to move/swipe down
function move_down(grid){
    let changed = null;
    let new_grid = [];

    //first we transpose the grid
    new_grid = transpose(grid);

    //then we move right
    new_grid, changed = move_right(new_grid);

    //then we transpose again
    new_grid = transpose(new_grid);
    return new_grid, changed;
}

module.export = {
    start_game,
    add_new_2,
    get_current_state,
    compress, merge, reverse,
    transpose,
    move_left,
    move_right,
    move_up,
    move_down
};