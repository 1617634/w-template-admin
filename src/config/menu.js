import { isUrl } from '../common/utils';
// const permissions = JSON.parse(localStorage.getItem("permissions")) || [];
const menuData = (permissions) => {
  return permissions&&permissions.map(one=>{
    let tmp = {};
    try {
      tmp.icon = JSON.parse(one.remark).icon;
    } catch (error) {
      tmp.icon = 'setting'
    }
    tmp.name = one.name; 
    tmp.path = one.code;
    tmp.children = one.menuVo;
    return tmp;
  })
}
function formatter(data, parentPath = '/', parentAuthority) {
  return data.map(item => {
    let { path } = item;
    if (!isUrl(path)) {
      path = parentPath + item.path;
    }
    const result = {
      ...item,
      path,
      authority: item.authority || parentAuthority,
    };
    
    if (item.children) {
      result.children = formatter(item.children, `${parentPath}${item.path}/`, item.authority);
    }
    return result;
  });
}

export const getMenuData = () => formatter(menuData(JSON.parse(localStorage.getItem("permissions")) || []));
// function formatter2(data, parentPath = '/', parentAuthority) {
//   return data.map(item => {
//     let { path } = item;
//     if (!isUrl(path)) {
//       path = parentPath + item.path;
//     }
//     const result = {
//       ...item,
//       path,
//       authority: item.authority || parentAuthority,
//     };
//     if (item.children) {
//       result.children = formatter(item.children, `${parentPath}${item.path}/`, item.authority);
//     }
//     return result;
//   });
  
// }





// function menuaa(){
//   const dataMenu = localStorage.getItem('userMenuList')?JSON.parse(localStorage.getItem('userMenuList')):[]
//   const dataList = dataMenu&&dataMenu.map((v,i)=>({
//       name:v.menuName,
//       path:v.menuPath,
//       children:v.children.map((vo,i)=>({
//         name:vo.menuName,
//         path:vo.menuPath,
//       }))
//   }))
//   return dataList
// }

// export const getMenuData = () => formatter2(menuaa());