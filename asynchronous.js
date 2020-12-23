
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

// /////////////////// ASYNCHRONOUS WITH PROMISES

// const getIDs=new Promise((resolve,reject)=>{
//     setTimeout(()=>{
//         resolve([523,883,432,974]);
//     },0);
// });
// const getRecipe=function(recID){
//     return new Promise((resolve,reject)=>{
//         setTimeout((id)=>{
//             const recipe={title:'Fresh tomato pasta',publisher:'Minh'}
//             resolve(recipe);
//         },1500,recID)
//     })
// }
// const getRelated=function(publisher){
//     return new Promise((resolve,reject)=>{
//         setTimeout((publisher)=>{
//             resolve(['Cookie',publisher]);
//         },1500,publisher)
//     })
// }
// getIDs
// .then((IDs)=>{
//     console.log()
//     return getRecipe(IDs[0]);
// })
// .then(recipe=>{
//     return getRelated(recipe.publisher);
// })
// .then(recipe2=>{
//     console.log(recipe2);
// })
// .catch(error=>{
//     console.log(`Error`);
//     console.log(error);
// })

// ///////////////////// From Promises to AsyncAwait
// const getIDs=new Promise((resolve,reject)=>{
//     setTimeout(()=>{
//         resolve([523,883,432,974]);
//     },0);
// });
// const getRecipe=function(recID){
//     return new Promise((resolve,reject)=>{
//         setTimeout((id)=>{
//             const recipe={title:'Fresh tomato pasta',publisher:'Minh'}
//             resolve(recipe);
//         },0,recID)
//     })
// }
// const getRelated=function(publisher){
//     return new Promise((resolve,reject)=>{
//         setTimeout((publisher)=>{
//             resolve(['Cookie',publisher]);
//         },0,publisher)
//     })
// }

// async function getRecipesAW(){
//     const IDs=await getIDs;
//     console.log(IDs);
//     const recipe=await getRecipe();
//     console.log(recipe);
//     const relateRecipe=await getRelated(recipe.publisher);
//     console.log(relateRecipe);
// }
// getRecipesAW();
// for(let i=0;i<5000;i++){
//     console.log(i);
// }

////////// Making AJAX Calls with Fetch and Promises

// function getWeather(id){
//     fetch(`https://www.metaweather.com/api/location/${id}/`)
//     .then((result)=>{
//         console.log(`First line`);
//         console.log(result);
//         return result.json();
//     })
//     .then(data=>{
//         console.log(`Data here`);
//         console.log(data);
//         const weatherToday=data.consolidated_weather[0];
//         console.log(`The weather today in ${data.title}`);
//         console.log(weatherToday);
//     })
//     .catch(error=>{ console.log(`Error here2`); console.log(error); });
// }

// //getWeather(1118370);
// getWeather(11183702131923218937131237112312323);

///////////// AJAX call with AsyncAwait
 async function getWeatherAW(woeid){
    try{
        const result=await fetch(`https://www.metaweather.com/api/location/${woeid}/`);
        const data=await result.json();
        const today= data.consolidated_weather[0];
        console.log(`Temperatures today in ${data.title} is between ${today.min_temp} and ${today.max_temp}`);
        return data;
    }
    catch(error){
        //console.log(error);
        alert(error);
    }
};

getWeatherAW(1118370);
let dataHoChiMinh;
getWeatherAW(1252431).then((data)=>{
    dataHoChiMinh=data;
    console.log(dataHoChiMinh);
})
getWeatherAW(111837000000000000000000000000000);