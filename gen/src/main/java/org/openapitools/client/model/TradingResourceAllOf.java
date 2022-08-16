/*
 * Space Tycoon
 * Space Tycoon server.
 *
 * The version of the OpenAPI document: 1.0.0
 * 
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 */


package org.openapitools.client.model;

import java.util.Objects;
import java.util.Arrays;
import com.google.gson.TypeAdapter;
import com.google.gson.annotations.JsonAdapter;
import com.google.gson.annotations.SerializedName;
import com.google.gson.stream.JsonReader;
import com.google.gson.stream.JsonWriter;
import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import java.io.IOException;

/**
 * TradingResourceAllOf
 */
@javax.annotation.Generated(value = "org.openapitools.codegen.languages.JavaClientCodegen", date = "2022-08-14T22:38:57.446108708+02:00[Europe/Zurich]")
public class TradingResourceAllOf {
  public static final String SERIALIZED_NAME_BUY_PRICE = "buy-price";
  @SerializedName(SERIALIZED_NAME_BUY_PRICE)
  private Double buyPrice;

  public static final String SERIALIZED_NAME_SELL_PRICE = "sell-price";
  @SerializedName(SERIALIZED_NAME_SELL_PRICE)
  private Double sellPrice;


  public TradingResourceAllOf buyPrice(Double buyPrice) {
    
    this.buyPrice = buyPrice;
    return this;
  }

   /**
   * Get buyPrice
   * @return buyPrice
  **/
  @javax.annotation.Nullable
  @ApiModelProperty(value = "")

  public Double getBuyPrice() {
    return buyPrice;
  }


  public void setBuyPrice(Double buyPrice) {
    this.buyPrice = buyPrice;
  }


  public TradingResourceAllOf sellPrice(Double sellPrice) {
    
    this.sellPrice = sellPrice;
    return this;
  }

   /**
   * Get sellPrice
   * @return sellPrice
  **/
  @javax.annotation.Nullable
  @ApiModelProperty(value = "")

  public Double getSellPrice() {
    return sellPrice;
  }


  public void setSellPrice(Double sellPrice) {
    this.sellPrice = sellPrice;
  }


  @Override
  public boolean equals(Object o) {
    if (this == o) {
      return true;
    }
    if (o == null || getClass() != o.getClass()) {
      return false;
    }
    TradingResourceAllOf tradingResourceAllOf = (TradingResourceAllOf) o;
    return Objects.equals(this.buyPrice, tradingResourceAllOf.buyPrice) &&
        Objects.equals(this.sellPrice, tradingResourceAllOf.sellPrice);
  }

  @Override
  public int hashCode() {
    return Objects.hash(buyPrice, sellPrice);
  }


  @Override
  public String toString() {
    StringBuilder sb = new StringBuilder();
    sb.append("class TradingResourceAllOf {\n");
    sb.append("    buyPrice: ").append(toIndentedString(buyPrice)).append("\n");
    sb.append("    sellPrice: ").append(toIndentedString(sellPrice)).append("\n");
    sb.append("}");
    return sb.toString();
  }

  /**
   * Convert the given object to string with each line indented by 4 spaces
   * (except the first line).
   */
  private String toIndentedString(Object o) {
    if (o == null) {
      return "null";
    }
    return o.toString().replace("\n", "\n    ");
  }

}
