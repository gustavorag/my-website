export default {
  StringUtils:{
    isEmpty : function(value){
      if(typeof value === "string" || value instanceof String){
        if(!value || value.length === 0){
          return true;
        }
        return false;
      }else if( value === null || value === undefined){
        return true;
      }else{
        throw {error:"The parameter must be a String"};
      }
    },
  }

}
