export default function MapLoader () {
  return new Promise((resolve, reject) => {
    if (window.AMap) {
      resolve({ AMap: window.AMap, Loca: window.Loca })
    } else {
      var map = document.createElement('script')
      map.type = 'text/javascript'
      map.async = true
      map.src = 'http://webapi.amap.com/maps?v=1.4.13&key=17fbe9e19c55b249fce7393f7b3340e1'
      map.onerror = reject
      document.head.appendChild(map)

      var loca = document.createElement('script')
      loca.type = 'text/javascript'
      loca.async = true
      loca.src = 'http://webapi.amap.com/loca?v=1.2.1&key=17fbe9e19c55b249fce7393f7b3340e1'
      loca.onerror = reject
      document.head.appendChild(loca)

      // resolve({ AMap: window.AMap, Loca: window.Loca })

      setTimeout(() => resolve({ AMap: window.AMap, Loca: window.Loca }), 1000)
    }
  })
}
