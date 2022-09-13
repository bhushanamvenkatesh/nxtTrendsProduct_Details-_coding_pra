// Write your code here

import './index.css'
import {Component} from 'react'
import Cookies from 'js-cookie'
import Loader from 'react-loader-spinner'
import 'react-loader-spinner/dist/loader/css/react-spinner-loader.css'
import Header from '../Header'
import SimilarProductItem from '../SimilarProductItem'

class ProductItemDetails extends Component {
  state = {productData: {}, isLoading: true}

  componentDidMount() {
    this.getProductData()
  }

  getProductData = async () => {
    const {match} = this.props

    const {params} = match
    const {id} = params
    const token = Cookies.get('jwt_token')
    const url = `https://apis.ccbp.in/products/${id}`
    const options = {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
    const response = await fetch(url, options)
    const data = await response.json()

    if (response.ok === true) {
      this.onSuccess(data)
    }
    if (response.ok !== true) {
      this.onFailure()
    }
  }

  getSimilarDataList = data => {
    const formattedData = data.map(each => ({
      id: each.id,
      imageUrl: each.image_url,
      title: each.title,
      style: each.style,

      brand: each.brand,
      price: each.price,
      rating: each.rating,
    }))

    return formattedData
  }

  onSuccess = data => {
    const formattedData = {
      availability: data.availability,
      brand: data.brand,
      description: data.description,
      id: data.id,
      imageUrl: data.image_url,
      price: data.price,
      rating: data.rating,
      similarProducts: [...this.getSimilarDataList(data.similar_products)],
      style: data.style,
      title: data.title,
      totalReviews: data.total_reviews,
    }
    this.setState({isLoading: false})

    this.setState({
      productData: formattedData,
    })
  }

  renderLoader = () => (
    <div className="loader">
      <Loader type="ThreeDots" color="#0b69ff" height={80} width={80} />
    </div>
  )

  getSimilarProductsList = lista => (
    <ui>
      {lista.map(each => (
        <SimilarProductItem each={each} />
      ))}
    </ui>
  )

  renderProductData = () => {
    const {productData} = this.state

    const {
      availability,
      brand,
      description,
      // id,
      imageUrl,
      price,
      rating,
      similarProducts,
      // style,
      title,
      totalReviews,
    } = productData

    return (
      <>
        <Header />
        <div className="product-container">
          <div className="product-details">
            <img src={imageUrl} alt={title} className="product-image" />

            <div className="details">
              <h1>{title}</h1>
              <p>{`Rs ${price}/-`}</p>
              <div className="review-container">
                <p className="rating-symbol">{rating}*</p>
                <p>{`${totalReviews} Reviews`}</p>
              </div>
              <p>{description}</p>
              <p>Available:{availability}</p>
              <p>Brand: {brand}</p>
              <hr />
              <div className="count-button">
                <button className="button" type="button">
                  +
                </button>
                <h1>0</h1>
                <button type="button" className="button">
                  -
                </button>
              </div>
              <button className="add-to-cart" type="button">
                Add to Cart
              </button>
            </div>
          </div>
          <div className="similar-details">
            <h1>Similar Products</h1>

            {this.getSimilarProductsList(similarProducts)}

            <SimilarProductItem />
          </div>
        </div>
      </>
    )
  }

  render() {
    const {isLoading} = this.state

    return isLoading ? this.renderLoader() : this.renderProductData()
  }
}

export default ProductItemDetails
