<template>
  <div class="pro-city-wp">
    <el-select v-model="pm" @change="provinceChange" placeholder="省/市">
      <el-option
        v-for="item in province"
        :key="item.value"
        :label="item.text"
        :value="item.text">
      </el-option>
    </el-select>
    <el-select v-model="cm" placeholder="市" @change="emitProCity">
      <el-option
        v-for="item in cityList"
        :key="item.value"
        :label="item.text"
        :value="item.text">
      </el-option>
    </el-select>
  </div>
</template>

<script>
  import {province, city} from "./cityData";

  export default {
    name: "proviceCity",
    data() {
      return {
        province: province,
        city: city,
        cm: '',
        pm: '',
        cityList: [],
      }
    },
    methods: {
      provinceChange(val) {//val是city文本
        this.cm = '';
        for (let q = 0; q < this.province.length; q++){
          if(this.province[q]['text'] == val){
            val = this.province[q]['value'];//val此时为编号
            break;
          }
        }
        let filterCity = this.city.filter(v => {
          if(v.parentId == val){
            return v;
          }else{
            return false;
          }
        });
        this.cityList = filterCity;
        this.emitProCity();
      },
      emitProCity() {
        this.$emit('changeProCityVal', {pro: this.pm, city: this.cm});
      }
    }
  }
</script>

<style scoped>
  .pro-city-wp{
    display: inline-block;
  }
</style>
