
// ////////////// ASYNCHRONOUS JAVASCRIPT
// const second=()=>{
//     setTimeout(()=>{
//         console.log(`Second`);
//     },2000);
// }
// const first=()=>{
//     console.log(`First`);
//     second();
//     console.log(`End`);
// }
// first();

// ////////////////// ASYNCHRONOUS WITH CALLBACKS

// function getRecipe(){
//     setTimeout(()=>{
//         const recipeID=[523,883,432];
//         console.log(recipeID);

//         setTimeout((id)=>{
//             const recipe={title:'Fresh tomato pasta',
//                             publisher:'Minh'
//             }
//             console.log(`${id} : ${recipe.title}`);

//             setTimeout(publisher=>{
//                 const recipe2={title:'Pizza',
//                             publisher:'Minh'
//             }
//             console.log(recipe2);
//             },1500,recipe.publisher)

//             console.log('MinhMinh');

//         },1000,recipeID[2]);

//     },1500)
// }
// getRecipe();

/////////////////// ASYNCHRONOUS WITH PROMISES

const getIDs=new Promise((resolve,reject)=>{
    setTimeout(()=>{
        resolve([523,883,432,974]);
    },0);
});
const getRecipe=function(recID){
    return new Promise((resolve,reject)=>{
        setTimeout((id)=>{
            const recipe={title:'Fresh tomato pasta',publisher:'Minh'}
            resolve(recipe);
        },1500,recID)
    })
}
const getRelated=function(publisher){
    return new Promise((resolve,reject)=>{
        setTimeout((publisher)=>{
            resolve(['Cookie',publisher]);
        },1500,publisher)
    })
}
getIDs
.then((IDs)=>{
    console.log()
    return getRecipe(IDs[0]);
})
.then(recipe=>{
    return getRelated(recipe.publisher);
})
.then(recipe2=>{
    console.log(recipe2);
})
.catch(error=>{
    console.log(`Error`);
    console.log(error);
})


