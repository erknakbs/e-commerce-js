const categoryList = document.querySelector('.categories');
const productList = document.querySelector('.products');
const modal = document.querySelector('.modal-wrapper');
const openBtn = document.querySelector('#open-btn');
const closeBtn = document.querySelector('#close-btn');
const modalList = document.querySelector('.modal-list');
const modalInfo = document.querySelector("#modal-info");

document.addEventListener('DOMContentLoaded', () => {
    // callback içerisinde farklı fonksiyonlar çalıştırır.
    fetchCategories();
    fetchProduct();
});

function fetchCategories() {
    //! Veri Çekme isteği atma
    fetch('https://api.escuelajs.co/api/v1/categories')
        //! Gelen veriyi işleme
        .then((res) => res.json())
        //! İşlenen veriyi ekrana basma
        .then((data) =>
            data.slice(0, 4).forEach((category) => {
                //! gelen her bir obje için div oluşturma
                const categoryDiv = document.createElement('div');
                //! div class ekleme
                categoryDiv.classList.add('category');
                //! Divin içeriğini değiştirme
                categoryDiv.innerHTML = `
                <img src="${category.image}">
                <span>${category.name}</span>
                `;
                //! oluşan divi htmldeki listeye atma
                categoryList.appendChild(categoryDiv);
            })
        );
}

// ürünleri çekme
function fetchProduct() {
    //! Apiye veri çekme isteği atma
    fetch('https://api.escuelajs.co/api/v1/products')
        //! istek başarılı olursa veriyi işle
        .then((res) => res.json())
        //! işlenen veriyi al ve ekrana bas
        .then((data) =>
            data.slice(0, 25).forEach((item) => {
                //! div oluştur
                const productDiv = document.createElement('div');
                //! div e class ekle
                productDiv.classList.add('product');
                //! divin içeriğini değiştirme
                productDiv.innerHTML = `
                <img src="${item.images[0]}">
                    <p>${item.title}</p>
                    <p>${item.category.name}</p>
                    <div class="product-action">
                        <p>${item.price}$</p>
                        <button onclick="addtoBasket({id:${item.id},title:'${item.title}',price:'${item.price}',img:'${item.images[0]}',amount:1})">Add to Basket</button>
                    </div>
                `;
                //! oluşan ürünü html listeye gönderme
                productList.appendChild(productDiv);
            })
        );
}

//! Sepet
let basket = [];
let total = 0

//! sepete ekle
function addtoBasket(product) {
    //! sepette bu elemandan varsa onu değişkene aktar
    const foundItem = basket.find((basketItem) => basketItem.id === product.id);

    if (foundItem) {
        //! eğer eleman sepette var ise uyarı ver
        foundItem.amount++;
    } else {
        //! eğer elemandan spette bulunmadıysa sepete
        basket.push(product);
    }
    console.log(product);
}


//! Açma ve Kapatma


openBtn.addEventListener("click", () => {
    modal.classList.add("active");
    // sepetin içine ürünleri listeleme
    addList();
    // toplam bilgisini güncelleme
    modalInfo.innerText = total;
});

closeBtn.addEventListener("click", () => {
    modal.classList.remove("active");
    //! Sepeti kapatınca içini temizleme
    modalList.innerHTML = '';
    //! total değer sıfırlama
    total = 0;
});

//! Sepete Listeleleme
function addList() {
    basket.forEach((product) => {
        // Sepet Dizisindeki her obje için div oluşturur.
        const listItem = document.createElement('div');
        // bunlara class ekle
        listItem.classList.add('list-item');
        // içeriğini değiştir.
        listItem.innerHTML = `
                <img src="${product.img}">
                <h2>${product.title}</h2>
                <h2 class="price">${product.price}$</h2>
                <p>Miktar: ${product.amount}</p>
                <button id="del" onclick="deleteItem({id:${product.id},price:${product.price},amount:${product.amount}})">Sil</button>
        `;
        //! ELemanı HTML'deki listeye gönderme
        modalList.appendChild(listItem);

        //! Toplam değişkenini güncelleme
        total += product.price * product.amount;
    });
}

//! Sepetten Silme fonksiyonu
function deleteItem(deleteingItem) {
    basket = basket.filter((i) => i.id !== deleteingItem.id);
    //! silinen elemanın fiyatını total'den çıkartma 
    total -= deleteingItem.price * deleteingItem.amount;

    modalInfo.innerText = total;
}

modalList.addEventListener("click", (e) => {
    if (e.target.id === 'del') {
        e.target.parentElement.remove();
    }
});

//! eğer çarpı dışında tıklanırsa kapatma
modal.addEventListener("click", (e) => {
    if (e.target.classList.contains("modal-wrapper")) {
        modal.classList.remove("active");
    }
});