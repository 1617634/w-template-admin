/* eslint-disable import/no-mutable-exports */
let CURRENT = 'NULL';
/**
 * use  authority or getAuthority
 * @param {string|()=>String} currentAuthority
 */
const renderAuthorize = Authorized => {
  return currentAuthority => {//currentAuthority => localStorage.getItem('antd-pro-authority')
    // console.log('的骄傲看似简单的', currentAuthority.constructor.name );
    if (currentAuthority) {
      if (currentAuthority.constructor.name === 'Function') {
        CURRENT = currentAuthority();
      }
      if (
        currentAuthority.constructor.name === 'String' ||
        currentAuthority.constructor.name === 'Array'
      ) {
        if (currentAuthority.constructor.name === 'String'&&currentAuthority.indexOf(",")>0){
          CURRENT = currentAuthority.split(",")
        }else{
          CURRENT = currentAuthority;
        }
      }
    } else {
      CURRENT = 'NULL';
    }
    return Authorized;
  };
};

export { CURRENT };
export default Authorized => renderAuthorize(Authorized);
