export interface Product {
    id: number;
    name: string;
    description: string;
    price: string;
    imageSrc: string;
  }
  
  export interface ComboData {
    id: number;
    name: string;
    data: string;
    products: Product[];
    isActive: boolean;
  }
  
  
export const combodata: ComboData[] = [
    {
        id: 1212158009,
        name: 'Hot Deals',
        data: 'hotdeals',
        isActive: false,
        products: [
            { id: 1938475610, name: 'Chicken Bucket', description: 'A bucket of our famous fried chicken.', price: '$20', imageSrc: 'https://res.cloudinary.com/dbonwxmgl/image/upload/v1731044437/l7xuyrqazfnkj4j0kmkk.png' },
            { id: 2837461029, name: 'Chicken Sandwich', description: 'A delicious chicken sandwich.', price: '$5', imageSrc: 'https://res.cloudinary.com/dbonwxmgl/image/upload/v1731044531/fbrttmcbp5rx0cqqabja.png' },
            { id: 3948571023, name: 'Grilled Chicken', description: 'Tender grilled chicken.', price: '$22', imageSrc: 'https://res.cloudinary.com/dbonwxmgl/image/upload/v1731044623/b98yjprdpdeuzrkp3gdd.png' },
            { id: 4857392014, name: 'Chicken Nuggets', description: 'Crispy chicken nuggets.', price: '$6', imageSrc: 'https://res.cloudinary.com/dbonwxmgl/image/upload/v1731044699/gvn1u2l5i6mw2lfofgev.png' },
            { id: 5768391024, name: 'Chicken Wrap', description: 'A tasty chicken wrap.', price: '$8', imageSrc: 'https://res.cloudinary.com/dbonwxmgl/image/upload/v1731046685/jdzis2scbg8esw1kavra.png' },
            { id: 6678391920, name: 'Chicken Salad', description: 'Fresh chicken salad.', price: '$10', imageSrc: 'https://res.cloudinary.com/dbonwxmgl/image/upload/v1731046784/sljg5wnjkzm1j9xjvvhv.png' }
        ],
    },
    {
        id: 2757868722,
        name: 'New Products',
        data: 'newproducts',
        isActive: false,
        products: [
            { id: 2348756319, name: 'Vegan Burger', description: 'A healthy vegan burger.', price: '$10', imageSrc: 'https://res.cloudinary.com/dbonwxmgl/image/upload/v1731046883/yyhms2l6c4u5jjxjrkrf.png' },
            { id: 4385792345, name: 'Spicy Wings', description: 'Hot and spicy wings.', price: '$7', imageSrc: 'https://res.cloudinary.com/dbonwxmgl/image/upload/v1731046958/tvgvph7l3cevx45vfam7.png' },
            { id: 9283746102, name: 'Chicken Tenders', description: 'Crispy chicken tenders.', price: '$9', imageSrc: 'https://res.cloudinary.com/dbonwxmgl/image/upload/v1731047028/y3tmw0b1gsdlrbk5htyw.png' },
            { id: 5738192010, name: 'BBQ Chicken', description: 'Barbecue flavored chicken.', price: '$11', imageSrc: 'https://res.cloudinary.com/dbonwxmgl/image/upload/v1731047098/fdy8jq9cozgbnhnugb2m.png' },
            { id: 7658391029, name: 'Chicken Popcorn', description: 'Bite-sized chicken popcorn.', price: '$6', imageSrc: 'https://res.cloudinary.com/dbonwxmgl/image/upload/v1731047177/lmvfmrmg6xh7oq0csfp8.png' },
            { id: 1938475620, name: 'Chicken Fries', description: 'Chicken fries with dip.', price: '$7', imageSrc: 'https://res.cloudinary.com/dbonwxmgl/image/upload/v1731047305/c9mf9cecui1s1vbzaajy.png' },
            { id: 3847562910, name: 'Chicken Pizza', description: 'Pizza topped with chicken.', price: '$15', imageSrc: 'https://res.cloudinary.com/dbonwxmgl/image/upload/v1731047388/czd8pjot7y2run7jtnol.png' }
        ],
    },
    {
        id: 3875875879,
        name: 'Single Combo',
        data: 'singlecombo',
        isActive: false,
        products: [
            { id: 1234567890, name: 'Solo Meal', description: 'A perfect meal for one.', price: '$12', imageSrc: 'https://res.cloudinary.com/dbonwxmgl/image/upload/v1731047465/wkkhkxh9olf37nifb0b4.png' },
            { id: 9876543210, name: 'Snack Combo', description: 'Light and quick meal.', price: '$8', imageSrc: 'https://res.cloudinary.com/dbonwxmgl/image/upload/v1731047540/voef6jdpqbsvdsbkdvle.png' },
            { id: 1122334455, name: 'Quick Bite', description: 'A quick snack.', price: '$5', imageSrc: 'https://res.cloudinary.com/dbonwxmgl/image/upload/v1731047603/lamlz93fbxjkq7u2v2ae.png' },
            { id: 2233445566, name: 'Mini Feast', description: 'A small feast for one.', price: '$10', imageSrc: 'https://res.cloudinary.com/dbonwxmgl/image/upload/v1731047388/czd8pjot7y2run7jtnol.png' }
        ],
    },
    {
        id: 4422549933,
        name: 'Combo for Sharing',
        data: 'comboforsharing',
        isActive: false,
        products: [
            { id: 3344556677, name: 'Family Pack', description: 'A meal for the whole family.', price: '$30', imageSrc: 'https://res.cloudinary.com/dbonwxmgl/image/upload/v1731046685/jdzis2scbg8esw1kavra.png' },
            { id: 4455667788, name: 'Party Pack', description: 'Great for parties.', price: '$40', imageSrc: 'https://res.cloudinary.com/dbonwxmgl/image/upload/v1731047388/czd8pjot7y2run7jtnol.png' },
            { id: 5566778899, name: 'Friends Pack', description: 'Perfect for friends gathering.', price: '$35', imageSrc: 'https://res.cloudinary.com/dbonwxmgl/image/upload/v1731047465/wkkhkxh9olf37nifb0b4.png' },
            { id: 6677889900, name: 'Couple Pack', description: 'Ideal for couples.', price: '$25', imageSrc: 'https://res.cloudinary.com/dbonwxmgl/image/upload/v1731047540/voef6jdpqbsvdsbkdvle.png' },
            { id: 7788990011, name: 'Office Pack', description: 'Great for office lunch.', price: '$50', imageSrc: 'https://res.cloudinary.com/dbonwxmgl/image/upload/v1731044699/gvn1u2l5i6mw2lfofgev.png' }
        ],
    },
    {
        id: 5563656465,
        name: 'Fried & Roasted',
        data: 'friedandroasted',
        isActive: false,
        products: [
            { id: 8899001122, name: 'Fried Chicken', description: 'Crispy fried chicken.', price: '$15', imageSrc: 'https://res.cloudinary.com/dbonwxmgl/image/upload/v1731046784/sljg5wnjkzm1j9xjvvhv.png' },
            { id: 9900112233, name: 'Roasted Chicken', description: 'Juicy roasted chicken.', price: '$18', imageSrc: 'https://res.cloudinary.com/dbonwxmgl/image/upload/v1731047388/czd8pjot7y2run7jtnol.png' },
            { id: 1011122334, name: 'Grilled Chicken Wings', description: 'Tasty grilled chicken wings.', price: '$14', imageSrc: 'https://res.cloudinary.com/dbonwxmgl/image/upload/v1731046958/tvgvph7l3cevx45vfam7.png' }
        ],
    },
    {
        id: 6758171889,
        name: 'Rice - Burger - Pasta',
        data: 'rbp',
        isActive: false,
        products: [
            { id: 1374926081, name: 'Cheeseburger', description: 'Delicious cheeseburger.', price: '$5', imageSrc: 'https://res.cloudinary.com/dbonwxmgl/image/upload/v1731046685/jdzis2scbg8esw1kavra.png' },
            { id: 2758409317, name: 'Spaghetti', description: 'Italian pasta with sauce.', price: '$12', imageSrc: 'https://res.cloudinary.com/dbonwxmgl/image/upload/v1731044531/fbrttmcbp5rx0cqqabja.png' },
            { id: 9483721650, name: 'Chicken Alfredo', description: 'Creamy chicken alfredo pasta.', price: '$14', imageSrc: 'https://res.cloudinary.com/dbonwxmgl/image/upload/v1731046883/yyhms2l6c4u5jjxjrkrf.png' },
            { id: 2837461920, name: 'Chicken Fried Rice', description: 'Savory chicken fried rice.', price: '$10', imageSrc: 'https://res.cloudinary.com/dbonwxmgl/image/upload/v1731047177/lmvfmrmg6xh7oq0csfp8.png' },
            { id: 4758392061, name: 'Beef Burger', description: 'Juicy beef burger.', price: '$7', imageSrc: 'https://res.cloudinary.com/dbonwxmgl/image/upload/v1731046784/sljg5wnjkzm1j9xjvvhv.png' }
        ],
    },
];
  