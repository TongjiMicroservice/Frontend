<template>
  <!-- 地址： -->
    <!-- <p>{{ rs }}</p> -->
</template>


<script>
// import myBMap from "../utils/myBMap";
// export default {
//   data() {
//     return {
//       rs:null
//     };},
// created(){
//   this.getLocation();
// },
// methods: {
//   getLocation() {
//     //Toast("如长时间未获取办理区域请手动选择");
//     myBMap.init().then(() => {
//       let that = this;
//       let geolocation = new BMap.Geolocation();
//       // 创建百度地理位置实例，代替 navigator.geolocation
//       geolocation.getCurrentPosition(function (e) {
//         if (this.getStatus() == BMAP_STATUS_SUCCESS) {
//           // 百度 geolocation 的经纬度属性不同，此处是 point.lat 而不是 coords.latitude
//           let point = new BMap.Point(e.point.lng, e.point.lat);
//           let gc = new BMap.Geocoder();
//           gc.getLocation(point, function (rs) {
//             that.rs=rs;
//             console.log(rs);
//             //<<<<<<<<<<<<<<<<需要的位置信息在这获取
//             // let values = Object.values(rs.addressComponents);
//             // let str = values.join(" ");
//             let values = [rs.addressComponents.city, rs.addressComponents.district, rs.business];
//             let str = values.join(" ");

//             alert(str);
//           });
//         } else {
//           Toast("定位失败，请手动选择区域或重新定位");
//           this.showloading = false;
//         }
//       });
//     });
//   },
// }
// }
</script>

<style>
</style>

