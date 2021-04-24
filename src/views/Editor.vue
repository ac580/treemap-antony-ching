<script>
import $ from 'jquery'
export default {
  name: "editor",
  components: {
  },
  data: function(){
      return{
          title: "Data",
          rowTitle: "Row Number",
          resultTitle: "Result",
          jsonModel: "",
          isJsonNotValid: true,
          isSizeInvalid: false,
          isAnyNameOver50: false,
          isAnyNameNotStr: false,
          isAnyWeightNotInt: false,
          isAnyValueNotInt: false,
          jsonFormatted: null,
          rowNum: 3,
          containerStr: '',
          showContainer: false,
          sampleJson:[
                { "name": "A", "weight": 3, "value": -0.02 }, 
                { "name": "B", "weight": 3, "value": 0.05 }, 
                { "name": "C", "weight": 6, "value": 0.015 }, 
                { "name": "D", "weight": 2, "value": -0.01 }, 
                { "name": "E", "weight": 3, "value": 0.01 }],    
    }
  },
  created: function(){
  },
  methods: {
        saveModel(){
            this.jsonFormatted = JSON.parse(this.jsonModel);
            if(this.rowNum < 1 || this.rowNum % 1 != 0 || this.rowNum > this.jsonFormatted.length){         
                alert("Row Number must be \n - An Integer that is greater than 0. \n - Lesser or equal to the array length.")
            }else{
                this.setupContainerProp();
            }
        },
        setupContainerProp(){
            let totalWeight = 0;
            let rowNumberCeil = 0;
            this.jsonFormatted.forEach(item => {
                totalWeight += item.weight;
            });


            rowNumberCeil = Math.ceil(totalWeight/this.rowNum);

            let filterOutOfBoundWeight = this.jsonFormatted.findIndex(item=>item['weight'] > Math.ceil(totalWeight/this.rowNum));
            if(filterOutOfBoundWeight != -1){
                alert("Weight:"+this.jsonFormatted[filterOutOfBoundWeight]['weight']+" is out of bound!, The maximum weight for this case is "+Math.ceil(totalWeight/this.rowNum)
                +" otherwise one row's width will be greater than 100%.");
            }
            else{
                for(let i in this.jsonFormatted){
                    this.jsonFormatted[i]['widthPercent'] = parseFloat((100/(rowNumberCeil/this.jsonFormatted[i]['weight'])).toFixed(1));
                    this.jsonFormatted[i]['formatValue'] = (this.roundToTwo(this.jsonFormatted[i]['value']*100))+"%";
                    if(this.jsonFormatted[i]['value'] >=0){
                        this.jsonFormatted[i]['bgColor'] = 'green';
                    }else{
                        this.jsonFormatted[i]['bgColor'] = 'red';
                    }
                }

                this.jsonFormatted = this.jsonFormatted.sort((a,b) => (a['widthPercent'] < b[['widthPercent']]) ? 1 : ((b['widthPercent'] < a['widthPercent']) ? -1 : 0));
                this.renderContainer();
            }
        },
        renderContainer(){
            this.fixOrderInList();
        
            this.jsonFormatted = this.jsonFormatted.sort((a,b) => (a['order'] > b[['order']]) ? 1 : ((b['order'] > a['order']) ? -1 : 0));
            let findOutOfBoundRow = this.jsonFormatted.findIndex(item=>item.order == this.rowNum);
            if(findOutOfBoundRow != -1){
                alert("Out of bound! Can't fill in all objects within "+ this.rowNum +" row(s).")
            }else{
                this.showContainer = true;
                this.containerStr = '';
                for(let i in this.jsonFormatted){
                    let item = this.jsonFormatted[i];

                    this.containerStr += 
                    '<div class="display-flex-item" style="outline: black solid 2px;width:'+item['widthPercent']+'%;background:'+item['bgColor']+';">'+
                        '<div class="item-name">'+item['name']+'</div>'+
                        '<div class="item-value">'+item['formatValue']+'</div>'+
                    '</div>';
                }

                console.log("render json",this.jsonFormatted);
            }

        },
        fixOrderInList(){
            for(let i in this.jsonFormatted){
                if(i-1 == -1){
                    this.jsonFormatted[i]['order'] = 0;
                }else{
                    let getWidthPercentOrder = this.sumOfWidthPercent(this.jsonFormatted.filter((item)=>item['order']==this.jsonFormatted[i-1]['order']));
                        
                    if(getWidthPercentOrder+this.jsonFormatted[i]['widthPercent'] <= 100){
                        this.jsonFormatted[i]['order'] = this.jsonFormatted[i-1]['order'];
                    }else{   
                        let prevOrderArr = [];
                        for(let j=0; j<=this.jsonFormatted[i-1]['order']; j++){
                            prevOrderArr.push(j);
                        }

                        for(let k in prevOrderArr){

                            let getWidthPercentOrder = this.sumOfWidthPercent(this.jsonFormatted.filter((item)=>item['order']==prevOrderArr[k]));
                                    
                            if(getWidthPercentOrder+this.jsonFormatted[i]['widthPercent'] <= 100){
                                this.jsonFormatted[i]['order'] = this.jsonFormatted[prevOrderArr[k]]['order'];
                                break;
                            }else{
                                this.jsonFormatted[i]['order'] = this.jsonFormatted[i-1]['order'] +1;
                            }
                        }
                    }
                }
            }
        },
        sumOfWidthPercent(arr){
            let sum = 0;
            arr.forEach(item => {
                sum += item.widthPercent;
            });
            return sum;
        },
        roundToTwo(num) {    
            return +(Math.round(num + "e+2")  + "e-2");
        },
        isJsonString(str) {
            try {
                JSON.parse(str);

                let parseJson = JSON.parse(str);
                if(parseJson.length>50 || parseJson.length<1){
                    this.isSizeInvalid = true;
                }else{
                    this.isSizeInvalid = false;

                    let checkNameTypeStrFilter = parseJson.findIndex(item=>typeof(item.name) != 'string');
                    if(checkNameTypeStrFilter!=-1){
                        this.isAnyNameNotStr = true;
                    }else{
                        this.isAnyNameNotStr = false;

                        let checkNameLengthFilter = parseJson.findIndex(item=>item.name.length > 50);
                        if(checkNameLengthFilter!=-1){
                            this.isAnyNameOver50 = true;
                        }else{
                            this.isAnyNameOver50 = false;

                            let checkWeightIntFilter = parseJson.findIndex(item=>typeof(item.weight) != 'number' || item.weight < 1 || item.weight % 1 != 0);
                            if(checkWeightIntFilter!=-1){
                                this.isAnyWeightNotInt = true;
                            }else{
                                this.isAnyWeightNotInt = false;

                                let checkValueIntFilter = parseJson.findIndex(item=>typeof(item.value) != 'number' || item.value > 1 || item.value < -1);
                                if(checkValueIntFilter!=-1){
                                    this.isAnyValueNotInt = true;
                                }else{
                                    this.isAnyValueNotInt = false;
                                }
                            }
                        }
                    }
                }

                this.isJsonNotValid = false;
            } catch (e) {
                this.isJsonNotValid = true;
            }
        },
        getSample(){
            this.jsonModel = "";
            this.jsonModel = JSON.stringify(this.sampleJson);
        },
        clearModel(){
            this.jsonModel = "";
            this.rowNum = 1;
            this.showContainer = false;
        },
        validateJson(){
            this.showContainer = false;
            if(this.isJsonNotValid){
                alert("Input JSON not valid, please check!");
            }else if(this.isSizeInvalid){
                alert("Length of Array (Input JSON) must be equal/less than 50 and greater than 1!");
            }else if(this.isAnyNameOver50){
                alert("Each name must not be longer than 50 characters!");
            }else if(this.isAnyNameNotStr){
                alert("Only accept string type for name!");
            }else if(this.isAnyWeightNotInt){
                alert("Only accept integer type for weight and it must be greater than 0!");
            }else if(this.isAnyValueNotInt){
                alert("Value must be an integer: \n - Not greater than 1. \n - Not lesser than -1.");
            }
            else{
                this.saveModel();
            }
        },
        goTop(){
            $('html,body').stop().animate({
                scrollTop: 0
            }, 'slow', 'swing');
        }
  },
  computed:{
      

  },
  watch:{
    jsonModel: function () {
        this.isJsonString(this.jsonModel);
    }   
  }
};
</script>

<template>
  <div class="editor">
    <div class="editor-left">
        <p>{{title}}</p>
        <textarea class="editor-textarea" v-model="jsonModel" rows="20" cols="100">
        </textarea>
        <br>
        <button class="action-button" v-on:click="getSample()">Get Sample Json</button>
        <br>
        <p>{{rowTitle}}</p>
        <input type="number" v-model="rowNum"/>

        <div class="button-class">
            <button class="action-button" :disabled="jsonModel == ''" v-on:click="validateJson()">Save</button>
            <button class="action-button next-button" v-on:click="clearModel()">Clear</button>
        </div>
    </div>
    <div class="editor-right">
        <p class="hide-on-mobile">{{resultTitle}}</p>
        <p class="show-on-mobile"  v-if="showContainer">{{resultTitle}}</p>
        <div class="result-container" v-if="showContainer">
            <div class="format-flex-row" v-html="containerStr"></div>
            <div class="show-on-mobile button-top-class">
                <button class="action-button top-button" v-on:click="goTop()">Back to top</button>
            </div>
        </div>
    </div>
  </div>
</template>