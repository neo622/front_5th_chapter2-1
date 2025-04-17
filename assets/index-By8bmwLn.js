(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const n of document.querySelectorAll('link[rel="modulepreload"]'))a(n);new MutationObserver(n=>{for(const o of n)if(o.type==="childList")for(const r of o.addedNodes)r.tagName==="LINK"&&r.rel==="modulepreload"&&a(r)}).observe(document,{childList:!0,subtree:!0});function s(n){const o={};return n.integrity&&(o.integrity=n.integrity),n.referrerPolicy&&(o.referrerPolicy=n.referrerPolicy),n.crossOrigin==="use-credentials"?o.credentials="include":n.crossOrigin==="anonymous"?o.credentials="omit":o.credentials="same-origin",o}function a(n){if(n.ep)return;n.ep=!0;const o=s(n);fetch(n.href,o)}})();const i={},d={container:"bg-gray-100 p-8",wrapper:"max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden md:max-w-2xl p-8",heading:"text-2xl font-bold mb-4",totalDisplay:"text-xl font-bold my-4",productSelect:"border rounded p-2 mr-2",addToCartBtn:"bg-blue-500 text-white px-4 py-2 rounded",stockStatusDisplay:"text-sm text-gray-500 mt-2"},h=(t,e)=>{const s=document.createElement(t);return s.className=e,s},E={p1:.1,p2:.15,p3:.2,p4:.05,p5:.25},q=10,v=30,p=.25,T=.1,L=.8,A=.95,I=3e4,S=6e4,y="x ",u=[{id:"p1",name:"상품1",price:1e4,quantity:50},{id:"p2",name:"상품2",price:2e4,quantity:30},{id:"p3",name:"상품3",price:3e4,quantity:20},{id:"p4",name:"상품4",price:15e3,quantity:0},{id:"p5",name:"상품5",price:25e3,quantity:10}],f=t=>u.find(e=>e.id===t),$=t=>parseInt(t.split(y)[1]),C=(t,e)=>`${t.split(y)[0]}${y}${e}`,D=()=>new Date().getDay()===2,P=t=>{const e=h("span","text-green-500 ml-2");return e.textContent=`(${(t*100).toFixed(1)}% 할인 적용)`,e},_=(t,e)=>e>=q&&E[t.id]||0,c={lastSelectedProductId:null,bonusPoints:0,totalAmount:0,totalItemCount:0};function w(){let t=0;c.totalAmount=0,c.totalItemCount=0;for(const s of i.$cartContainer.children){const a=f(s.id),n=$(s.querySelector("span").textContent),o=a.price*n,r=_(a,n);c.totalItemCount+=n,t+=o,c.totalAmount+=o*(1-r)}let e=(t-c.totalAmount)/t||0;return c.totalItemCount>=v&&t*p>t-c.totalAmount&&(c.totalAmount=t*(1-p),e=p),D()&&(c.totalAmount*=1-T,e=Math.max(e,T)),{finalDiscountRate:e}}function B(t){if(i.$totalDisplay.textContent=`총액: ${Math.round(c.totalAmount)}원`,t>0){const e=P(t);i.$totalDisplay.appendChild(e)}}function O(){c.bonusPoints=Math.floor(c.totalAmount/1e3);let t=document.getElementById("loyalty-points");t||(t=h("span","text-blue-500 ml-2"),t.id="loyalty-points",i.$totalDisplay.appendChild(t)),t.textContent=`(포인트: ${c.bonusPoints})`}function M(){i.$stockStatusDisplay.textContent=u.filter(t=>t.quantity<5).map(t=>`${t.name}: ${t.quantity>0?`재고 부족 (${t.quantity}개 남음)`:"품절"}`).join(`
`)}const g=()=>{const{finalDiscountRate:t}=w();B(t),M(),O()},N=()=>{i.$addToCartBtn.addEventListener("click",()=>{const t=i.$productSelect.value,e=f(t);if(e&&e.quantity>0){const s=document.getElementById(e.id);if(s){const a=s.querySelector("span"),o=$(a.textContent)+1;o<=e.quantity?(a.textContent=C(a.textContent,o),e.quantity--):alert("재고가 부족합니다.")}else{const a=h("div","flex justify-between items-center mb-2");a.id=e.id,a.innerHTML=`<span>${e.name} - ${e.price}원 x 1</span>
            <div>
              <button class="quantity-change bg-blue-500 text-white px-2 py-1 rounded mr-1" data-product-id="${e.id}" data-change="-1">-</button>
              <button class="quantity-change bg-blue-500 text-white px-2 py-1 rounded mr-1" data-product-id="${e.id}" data-change="1">+</button>
              <button class="remove-item bg-red-500 text-white px-2 py-1 rounded" data-product-id="${e.id}">삭제</button>
            </div>`,i.$cartContainer.appendChild(a),e.quantity--}g(),c.lastSelectedProductId=t}}),i.$cartContainer.addEventListener("click",t=>{const e=t.target;if(e.classList.contains("quantity-change")||e.classList.contains("remove-item")){const s=e.dataset.productId,a=document.getElementById(s),n=f(s),o=a.querySelector("span"),r=$(o.textContent);if(e.classList.contains("quantity-change")){const m=parseInt(e.dataset.change),l=r+m;l>0&&l<=n.quantity+r?(o.textContent=C(o.textContent,l),n.quantity-=m):l<=0?(a.remove(),n.quantity-=m):alert("재고가 부족합니다.")}else e.classList.contains("remove-item")&&(n.quantity+=r,a.remove());g()}})};function R(t){const e=document.createElement("option");return e.value=t.id,e.textContent=`${t.name} - ${t.price}원`,t.quantity===0&&(e.disabled=!0),e}const x=()=>{i.$productSelect.innerHTML="",u.forEach(t=>{i.$productSelect.appendChild(R(t))})},b=()=>{setTimeout(()=>{setInterval(()=>{const t=u[Math.floor(Math.random()*u.length)];Math.random()<.3&&t.quantity>0&&(t.price=Math.round(t.price*L),alert(`번개세일! ${t.name}이(가) 20% 할인 중입니다!`),x())},I)},Math.random()*I),setTimeout(()=>{setInterval(()=>{if(store.lastSelectedProductId){const t=u.find(e=>e.id!==store.lastSelectedProductId&&e.quantity>0);t&&(alert(`${t.name}은(는) 어떠세요? 지금 구매하시면 5% 추가 할인!`),t.price=Math.round(t.price*A),x())}},S)},Math.random()*S)};function U(){const t=document.getElementById("app");t.innerHTML=`
    <div class="${d.container}">
      <div class="${d.wrapper}">
        <h1 class="${d.heading}">장바구니</h1>
        <div id="cart-items"></div>
        <div id="cart-total" class="${d.totalDisplay}"></div>
        <select id="product-select" class="${d.productSelect}"></select>
        <button id="add-to-cart" class="${d.addToCartBtn}">추가</button>
        <div id="stock-status" class="${d.stockStatusDisplay}"></div>
      </div>
    </div>
  `,i.$cartContainer=document.getElementById("cart-items"),i.$totalDisplay=document.getElementById("cart-total"),i.$productSelect=document.getElementById("product-select"),i.$addToCartBtn=document.getElementById("add-to-cart"),i.$stockStatusDisplay=document.getElementById("stock-status"),x(),g(),b()}U();b();N();
