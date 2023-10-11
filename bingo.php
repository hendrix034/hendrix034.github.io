<!DOCTYPE html>
<html>
<head>
    <style>
        table {
            border-collapse: collapse;
        }
        td, th {
            border: 1px solid black;
            width: 50px;
            height: 50px;
            text-align: center;
            font-size: 20px;
            cursor: pointer;
        }
        .marked {
            background-color: lightgreen;
        }
    </style>
    <script>
        const listBallOut = []
        const winRow = []
        function toggleMarked(cell,letter,cellValue) {
            
            // console.log(cell)
            // var ball = document.getElementById('label1').value.slice(2)
                    
            if(listBallOut.includes(cellValue)){
                cell.classList.toggle('marked');
                if(!winRow.includes(letter)){
                    winRow.push(letter)

                    if (winRow.length == 5){
                        alert('You Win')
                     
                        var xhr = new XMLHttpRequest();

                        // Define the request
                        xhr.open('POST', 'save_win.php', true);
                        xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');

                        // Handle the response
                        xhr.onreadystatechange = function() {
                            if (xhr.readyState === 4) {
                                if (xhr.status === 200) {
                                    // Handle the response from the server
                                    if (xhr.responseText === 'Success') {
                                        // The update was successful
                                        alert('You Win, and your win data has been saved!');
                                    } else {
                                        // Handle the error
                                        alert('An error occurred while saving your win data.');
                                    }
                                }
                            }
                        };

                        // Send the request with the winData
                        xhr.send('winData=' + encodeURIComponent(localStorage.getItem('username')));
                    }
                }
            }
            
            
        }
        function generateBingoBall(){
            
            var randomNumber = 0;
            while (true) {
                // Generate a random number between 1 and 10 (you can adjust the range as needed)
                randomNumber = Math.floor(Math.random() * (85 - 1 + 1)) + 1;

                // Check if the random number exists in the array
                if (!listBallOut.includes(randomNumber)) {
                    // If it doesn't exist, push it to the array
                    listBallOut.push(randomNumber);
                    break; // Exit the loop
                }
            }
            var letter = '';
            
        
            if (randomNumber >= 1 && randomNumber <= 25) {
                letter = 'B';
            } else if (randomNumber >= 26 && randomNumber <= 40) {
                letter = 'I';
            } else if (randomNumber >= 41 && randomNumber <= 55) {
                letter = 'N';
            } else if (randomNumber >= 56 && randomNumber <= 70) {
                letter = 'G';
            } else if (randomNumber >= 71 && randomNumber <= 85) {
                letter = 'O';
            }
            var ball = letter + '-' + randomNumber;

            document.getElementById("ballOut").innerHTML = document.getElementById("ballOut").innerHTML + ',' + ball;
        }
    </script>
</head>
<body>
 <!-- <button id="ball" value="">Click to Generate Number</button> -->
<?php
function generateBingoNumber($column,$minRange,$maxRange) {
    
    return rand($minRange, $maxRange);

}
// function generateBingoBall() {
//     $randomNumber = rand(1,85);
//     $letter = '';
    
  
//     if ($randomNumber >= 1 && $randomNumber <= 25) {
//       $letter = 'B';
//     } else if ($randomNumber >= 26 && $randomNumber <= 40) {
//       $letter = 'I';
//     } else if ($randomNumber >= 41 && $randomNumber <= 55) {
//       $letter = 'N';
//     } else if ($randomNumber >= 56 && $randomNumber <= 70) {
//       $letter = 'G';
//     } else if ($randomNumber >= 71 && $randomNumber <= 85) {
//       $letter = 'O';
//     }
  
//     return $letter.'-'.$randomNumber;
// }

// $ball = generateBingoBall();

$bingoCard = array();
$minColRange = array(1,26,41,56,71);
$maxColRange = array(25,40,55,70,85);
// $minColRange = array(1,8,15,22,29);
// $maxColRange = array(7,14,21,28,35);
for ($col = 1; $col <= 5; $col++) {
    $bingoColumn = array();
    
    while (count($bingoColumn) < 5) {
        $number = generateBingoNumber($col,$minColRange[$col-1],$maxColRange[$col-1]);
        if (!in_array($number, $bingoColumn)) {
            $bingoColumn[] = $number;
        }
    }
    
    $bingoCard[] = $bingoColumn;
}
echo '<button onclick="generateBingoBall()">Click to Generate Number</button><br/><label id="ballOut"></label>';
echo '<table>';
echo '<tr><th>B</th>
        <th>I</th>
        <th>N</th>
        <th>G</th>
        <th>O</th></tr>';
for ($i = 0; $i < 5; $i++) {
    echo '<tr>';
    for ($j = 0; $j < 5; $j++) {
        $cellValue = $bingoCard[$j][$i];
        echo '<td id="" onclick="toggleMarked(this,'.$j.','.$cellValue.')">' . $cellValue . '</td>';
    }
    echo '</tr>';
}
echo '</table>';
?>
</body>
</html>
