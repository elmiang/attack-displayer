function validateFields(object, keys) {
  keys.forEach(function (k) {
      if (k in object) {
          console.log(k + ": " + object[k]);
          if (object[k] === '') {
              console.log(k + " exists but is empty");
              return false;
          }
          return;
      }
      console.log(k + " doesn't exist in object");
      return false;
  });
  return true;
}

const validationFields = ['attackerID', 'attackerName', 'attackRoll', 'attackDamage'];