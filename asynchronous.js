
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

////////////////// ASYNCHRONOUS WITH CALLBACKS

function getRecipe(){
    setTimeout(()=>{
        const recipeID=[523,883,432];
        console.log(recipeID);

        setTimeout((id)=>{
            const recipe={title:'Fresh tomato pasta',
                            publisher:'Minh'
            }
            console.log(`${id} : ${recipe.title}`);

            setTimeout(publisher=>{
                const recipe2={title:'Pizza',
                            publisher:'Minh'
            }
            console.log(recipe2);
            },1500,recipe.publisher)
        },1000,recipeID[2]);

    },1500)
}

getRecipe();

