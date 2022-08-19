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
 * ShipClass
 */
@javax.annotation.Generated(value = "org.openapitools.codegen.languages.JavaClientCodegen", date = "2022-08-14T22:38:57.446108708+02:00[Europe/Zurich]")
public class ShipClass {
  public static final String SERIALIZED_NAME_NAME = "name";
  @SerializedName(SERIALIZED_NAME_NAME)
  private String name;

  public static final String SERIALIZED_NAME_SHIPYARD = "shipyard";
  @SerializedName(SERIALIZED_NAME_SHIPYARD)
  private Boolean shipyard;

  public static final String SERIALIZED_NAME_SPEED = "speed";
  @SerializedName(SERIALIZED_NAME_SPEED)
  private Double speed;

  public static final String SERIALIZED_NAME_CARGO_CAPACITY = "cargo-capacity";
  @SerializedName(SERIALIZED_NAME_CARGO_CAPACITY)
  private Long cargoCapacity;

  public static final String SERIALIZED_NAME_LIFE = "life";
  @SerializedName(SERIALIZED_NAME_LIFE)
  private Long life;

  public static final String SERIALIZED_NAME_DAMAGE = "damage";
  @SerializedName(SERIALIZED_NAME_DAMAGE)
  private Long damage;

  public static final String SERIALIZED_NAME_PRICE = "price";
  @SerializedName(SERIALIZED_NAME_PRICE)
  private Long price;


  public ShipClass name(String name) {
    
    this.name = name;
    return this;
  }

   /**
   * Get name
   * @return name
  **/
  @ApiModelProperty(required = true, value = "")

  public String getName() {
    return name;
  }


  public void setName(String name) {
    this.name = name;
  }


  public ShipClass shipyard(Boolean shipyard) {
    
    this.shipyard = shipyard;
    return this;
  }

   /**
   * whether ships of this class are allowed to construct new ships
   * @return shipyard
  **/
  @ApiModelProperty(required = true, value = "whether ships of this class are allowed to construct new ships")

  public Boolean getShipyard() {
    return shipyard;
  }


  public void setShipyard(Boolean shipyard) {
    this.shipyard = shipyard;
  }


  public ShipClass speed(Double speed) {
    
    this.speed = speed;
    return this;
  }

   /**
   * Get speed
   * @return speed
  **/
  @ApiModelProperty(required = true, value = "")

  public Double getSpeed() {
    return speed;
  }


  public void setSpeed(Double speed) {
    this.speed = speed;
  }


  public ShipClass cargoCapacity(Long cargoCapacity) {
    
    this.cargoCapacity = cargoCapacity;
    return this;
  }

   /**
   * maximum number of resources the ship can carry - sum over all types of resources
   * @return cargoCapacity
  **/
  @ApiModelProperty(required = true, value = "maximum number of resources the ship can carry - sum over all types of resources")

  public Long getCargoCapacity() {
    return cargoCapacity;
  }


  public void setCargoCapacity(Long cargoCapacity) {
    this.cargoCapacity = cargoCapacity;
  }


  public ShipClass life(Long life) {
    
    this.life = life;
    return this;
  }

   /**
   * Get life
   * @return life
  **/
  @ApiModelProperty(required = true, value = "")

  public Long getLife() {
    return life;
  }


  public void setLife(Long life) {
    this.life = life;
  }


  public ShipClass damage(Long damage) {
    
    this.damage = damage;
    return this;
  }

   /**
   * Get damage
   * @return damage
  **/
  @ApiModelProperty(required = true, value = "")

  public Long getDamage() {
    return damage;
  }


  public void setDamage(Long damage) {
    this.damage = damage;
  }


  public ShipClass price(Long price) {
    
    this.price = price;
    return this;
  }

   /**
   * Get price
   * @return price
  **/
  @ApiModelProperty(required = true, value = "")

  public Long getPrice() {
    return price;
  }


  public void setPrice(Long price) {
    this.price = price;
  }


  @Override
  public boolean equals(Object o) {
    if (this == o) {
      return true;
    }
    if (o == null || getClass() != o.getClass()) {
      return false;
    }
    ShipClass shipClass = (ShipClass) o;
    return Objects.equals(this.name, shipClass.name) &&
        Objects.equals(this.shipyard, shipClass.shipyard) &&
        Objects.equals(this.speed, shipClass.speed) &&
        Objects.equals(this.cargoCapacity, shipClass.cargoCapacity) &&
        Objects.equals(this.life, shipClass.life) &&
        Objects.equals(this.damage, shipClass.damage) &&
        Objects.equals(this.price, shipClass.price);
  }

  @Override
  public int hashCode() {
    return Objects.hash(name, shipyard, speed, cargoCapacity, life, damage, price);
  }


  @Override
  public String toString() {
    StringBuilder sb = new StringBuilder();
    sb.append("class ShipClass {\n");
    sb.append("    name: ").append(toIndentedString(name)).append("\n");
    sb.append("    shipyard: ").append(toIndentedString(shipyard)).append("\n");
    sb.append("    speed: ").append(toIndentedString(speed)).append("\n");
    sb.append("    cargoCapacity: ").append(toIndentedString(cargoCapacity)).append("\n");
    sb.append("    life: ").append(toIndentedString(life)).append("\n");
    sb.append("    damage: ").append(toIndentedString(damage)).append("\n");
    sb.append("    price: ").append(toIndentedString(price)).append("\n");
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
