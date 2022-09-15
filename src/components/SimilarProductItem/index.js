// Write your code here
import './index.css'
import {AiFillStar} from 'react-icons/ai'

const SimilarProductItem = props => {
  console.log(props)
  const {similarProducts} = props

  return (
    <ul className="similar-products-list">
      {similarProducts.map(each => (
        <li key={each.id} className="similar-product-container">
          <img
            src={each.imageUrl}
            alt="similar product"
            className="similar-product-image"
          />
          <div>
            <p>{each.title}</p>
            <p>{each.brand}</p>
          </div>
          <div className="price-rating">
            <p>{`Rs.${each.price}/-`}</p>
            <div className="rating-containers">
              <p>{each.rating}</p>
              <AiFillStar className="star" />
            </div>
          </div>
        </li>
      ))}
    </ul>
  )
}

export default SimilarProductItem
