exports.create_allocation = (quizid, students, questions, questions_per_head)=>{
    
    return new Promise((resolve, reject)=>{
        //check if enough questions available to allocate
        if(questions.length < questions_per_head){
            reject(new Error("not enough available questions, cant allocate"))
        }
        let allocation_count = 2
        let allocation_map = []
        let allocation_item_start = "("
        let allocation_item_end = ")"
        let quizid_string = quizid
        let attempt_status = 0  //0 => unattempted, 1 => wrong ans, 2 => correct ans
        let response = 0    //option no.
        let score = 0   //1 or 0
        let time = 0    //in miliseconds 
        
        let j = 0
        for(let i = 0; i< students.length; i++){
            let count = 0
            while(count < allocation_count){
                let allocation_item = allocation_item_start + quizid_string +","+ students[i].sid +","+ questions[j].quesid +","+ 
                        attempt_status +","+ score + ","+ time + allocation_item_end
    
                // console.log(allocation_item)
                allocation_map.push(allocation_item)
                count = count + 1
                j = (j+1) % questions.length
            }
        }
        resolve(allocation_map)
    })
    
}