document.addEventListener("DOMContentLoaded", function(){
    const searchButton = document.getElementById("search-btn");
    const usernameInput = document.getElementById("user-input");
    const statsContainer = document.querySelector(".stats-container")
    const easyProgressCircle = document.querySelector(".easy-progress")
    const mediumProgressCircle = document.querySelector(".medium-progress")
    const hardProgressCircle = document.querySelector(".hard-progress")
    const easyLabel = document.getElementById("easy-lable")
    const mediumLabel = document.getElementById("medium-lable")
    const hardLabel = document.getElementById("hard-lable")
    const cardStatsContainer = document.querySelector(".stats-cards")
    const resetButton = document.getElementById("reset-btn")

    function validateUsername(username) {
        if(username.trim() === ""){
            alert("Username should not be empty");
            return false;
        }
        const regx = /^[a-zA-Z0-9_-]{1,15}$/;
        const isMatching = regx.test(username);
        if(!isMatching){
            alert("Invalid Username")
        }
        return isMatching;
    }


    async function fetchUserDetails(username) {
        const url = `https://leetcode-stats-api.herokuapp.com/${username}`

        try{

            searchButton.textContent = "Searching";
            searchButton.disabled = true;

            statsContainer.classList.add("hidden");

            const response = await fetch(url);
            if(!response.ok){
                throw new Error("Unable to fetch the User details");
            }
            const data = await response.json();
            // console.log("logging data", data);

            displayUserData(data);
        }
        catch(error){
            statsContainer.innerHTML = `<p>No Data Found</p>`

        }
        finally{
            searchButton.textContent = "Search";
            searchButton.disabled = false;
        }
    }

    
    function updateProgress(solved, total, label, circle){
       const progressDegree = (solved / total) * 100;
       circle.style.setProperty("--progress-degree", `${progressDegree}%`);
       label.textContent = `${solved} / ${total}`;
    }

    function displayUserData(data){
        const totalQues = data.totalQuestions;
        const totalEasyQues = data.totalEasy;
        const totalMediumQues = data.totalMedium;
        const totalHardQues = data.totalHard;

        const solvedTotalQues = data.totalSolved;
        const solvedTotalEasyQues = data.easySolved;
        const solvedTotalMediumQues = data.mediumSolved;
        const solvedTotalHardQues = data.hardSolved;

        updateProgress(solvedTotalEasyQues, totalEasyQues, easyLabel, easyProgressCircle);
        updateProgress(solvedTotalMediumQues, totalMediumQues, mediumLabel, mediumProgressCircle);
        updateProgress(solvedTotalHardQues, totalHardQues, hardLabel, hardProgressCircle);

        const cardsData = [
            {label: "OverAll Submission", value: data.totalSolved},
            {label: "AcceptanceRate of code", value: data.acceptanceRate},
            {label: "Ranking", value: data.ranking},
            {label: "Contribution Points", value: data.contributionPoints}
        ];

        // console.log("card data", cardsData);
        
        cardStatsContainer.innerHTML = cardsData.map(
            data =>
               `<div class="card">
                <h4>${data.label}</h4>
                <p>${data.value}</p>
             </div>`   
        ).join("");

        statsContainer.classList.remove("hidden");

    }


    searchButton.addEventListener('click', function(){
        const username = usernameInput.value;
        // console.log("Loggin username", username);
        if(validateUsername(username)){
          fetchUserDetails(username)
        }
    })

    resetButton.addEventListener('click', function(){
        usernameInput.value = "";
       statsContainer.classList.add("hidden")
       cardStatsContainer.innerHTML = ""
    })

})

