// Write your code here
import {BsDashSquare, BsPlusSquare} from 'react-icons/bs'
import './index.css'
import {Component} from 'react'
import Cookies from 'js-cookie'
import Loader from 'react-loader-spinner'
import 'react-loader-spinner/dist/loader/css/react-spinner-loader.css'
import Header from '../Header'
import SimilarProductItem from '../SimilarProductItem'

const statusConstants = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
}

class ProductItemDetails extends Component {
  state = {
    productData: {},
    // isLoading: true,
    count: 1,
    status: statusConstants.initial,
  }

  componentDidMount() {
    this.getProductData()
  }

  getProductData = async () => {
    this.setState({status: statusConstants.initial})

    const {match} = this.props

    const {params} = match
    const {id} = params
    const token = Cookies.get('jwt_token')
    const url = `https://apis.ccbp.in/products/${id}`
    const options = {
      // method: 'GET',
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

  onFailure = () => {
    this.setState({status: statusConstants.failure})
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

    this.setState({
      productData: formattedData,
      // isLoading: false,
      status: statusConstants.success,
    })
  }

  renderLoader = () => (
    <div className="loader" testid="loader">
      <Loader type="ThreeDots" color="#0b69ff" height={80} width={80} />
    </div>
  )

  onClickInc = () => {
    this.setState(prevState => ({
      count: prevState.count + 1,
    }))
  }

  onClickDecre = () => {
    const {count} = this.state
    if (count > 1) {
      this.setState(prevState => ({
        count: prevState.count - 1,
      }))
    }
  }

  renderProductData = () => {
    const {productData, count} = this.state

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
            <img src={imageUrl} alt="product" className="product-image" />

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
                <button
                  type="button"
                  onClick={this.onClickDecre}
                  className="button"
                  testid="minus"
                >
                  <BsDashSquare />
                </button>

                <p>{count}</p>
                <button
                  className="button"
                  type="button"
                  onClick={this.onClickInc}
                  testid="plus"
                >
                  <BsPlusSquare />
                </button>
              </div>
              <button className="add-to-cart" type="button">
                Add to Cart
              </button>
            </div>
          </div>
          <div className="similar-details">
            <h1>Similar Products</h1>

            <SimilarProductItem similarProducts={similarProducts} />
          </div>
        </div>
      </>
    )
  }

  onClickContinueShopping = () => {
    const {history} = this.props
    history.replace('/products')
  }

  renderFailure = () => (
    <div>
      <Header />
      <img
        src="https://assets.ccbp.in/frontend/react-js/nxt-trendz-error-view-img.png"
        alt="failure view"
        className=""
      />
      <h1>Product Not Found</h1>
      <button type="button" onClick={this.onClickContinueShopping}>
        Continue Shopping
      </button>
    </div>
  )

  render() {
    const {status} = this.state

    switch (status) {
      case statusConstants.initial:
        return this.renderLoader()

      case statusConstants.failure:
        return this.renderFailure()
      case statusConstants.success:
        return this.renderProductData()

      default:
        return null
    }

    // return isLoading ? this.renderLoader() : this.renderProductData()
  }
}

export default ProductItemDetails
