import React, { Component, PropTypes } from "react";
import { Translation } from "/imports/plugins/core/ui/client/components";
import { formatPriceString } from "/client/api";

class LineItems extends Component {
  constructor(props) {
    super(props);
    this.renderLineItem = this.renderLineItem.bind(this);
    this.calculateTotal = this.calculateTotal.bind(this);
  }

  calculateTotal(price, shipping, taxes) {
    return formatPriceString(price + shipping + taxes);
  }

  renderLineItem(uniqueItem, quantity) {
    return (
      <div className="order-items">
        <div
          className="invoice order-item form-group order-summary-form-group"
          onClick={() => this.props.handleClick(uniqueItem.cartItemId)}
          style={{ marginLeft: -15, marginRight: -15 }}
        >
          <div className="order-item-media" style={{ marginLeft: 15 }}>
            { !this.props.displayMedia(uniqueItem.variants) &&
              <img src= "/resources/placeholder.gif" />
            }
          </div>
          <div className="order-item-details">
            <div className="order-detail-title">
            {uniqueItem.title} <br/><small>{uniqueItem.variants.title}</small>
            </div>
          </div>
          <div className="order-detail-quantity">
            {quantity || 1}
          </div>
          <div className="order-detail-price">
            <div className="invoice-details" style={{ marginRight: 15 }}>
              <strong>{formatPriceString(uniqueItem.variants.price)}</strong>
            </div>
          </div>
      </div>
    </div>
    );
  }

  renderLineItemInvoice(uniqueItem) {
    return (
      <div>
        <div className="order-summary-form-group">
          <strong><Translation defaultValue="Subtotal" i18nKey="cartSubTotals.subtotal"/></strong>
          <div className="invoice-details">
            {formatPriceString(uniqueItem.variants.price)}
          </div>
        </div>
        <div className="order-summary-form-group">
          <strong><Translation defaultValue="Shipping" i18nKey="cartSubTotals.shipping"/></strong>
          <div className="invoice-details">
            {formatPriceString(this.props.invoice.shipping)}
          </div>
        </div>
        <div className="order-summary-form-group">
          <strong>Item tax</strong>
          <div className="invoice-details">
            {formatPriceString(this.props.invoice.taxes)}
          </div>
        </div>
        <div className="order-summary-form-group">
          <strong>Tax code</strong>
          <div className="invoice-details">
            {uniqueItem.variants.taxCode}
          </div>
        </div>
        <div className="order-summary-form-group">
          <strong>TOTAL</strong>
          <div className="invoice-details">
            <strong> {this.calculateTotal(uniqueItem.variants.price, this.props.invoice.shipping, this.props.invoice.taxes)} </strong>
          </div>
        </div>
        <br/>
      </div>
    );
  }

  render() {
    const { uniqueItems, isExpanded, onClose } = this.props;
    return (
      <div>
        {uniqueItems.map((uniqueItem) => {
          if (!isExpanded(uniqueItem.cartItemId)) {
            return (
              <div key={uniqueItem.cartItemId}> { this.renderLineItem(uniqueItem.items[0], uniqueItem.items.length) } </div>
            );
          }
          return (
            <div className="roll-up-invoice-list" key={uniqueItem.cartItemId}>
              <div style={{ float: "right" }}>
                <button className="rui btn btn-default flat icon-only" onClick={() => onClose(uniqueItem.cartItemId)}>
                  <i
                    className="rui font-icon fa-lg fa fa-times"
                  />
                </button>
              </div><br/><br/>
              {uniqueItem.items.map((item) => (
                <div key={item._id}>
                  { this.renderLineItem(item) }
                  { this.renderLineItemInvoice(item) }
                </div>
              ))}
            </div>
          );
        })}
      </div>
    );
  }
}

LineItems.propTypes = {
  displayMedia: PropTypes.func,
  handleClick: PropTypes.func,
  isExpanded: PropTypes.func,
  onClose: PropTypes.func,
  uniqueItems: PropTypes.array
};

export default LineItems;
