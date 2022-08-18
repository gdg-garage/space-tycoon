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
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import org.openapitools.client.model.ShipClass;

/**
 * StaticData
 */
@javax.annotation.Generated(value = "org.openapitools.codegen.languages.JavaClientCodegen", date = "2022-08-14T22:38:57.446108708+02:00[Europe/Zurich]")
public class StaticData {
  public static final String SERIALIZED_NAME_SHIP_CLASSES = "ship-classes";
  @SerializedName(SERIALIZED_NAME_SHIP_CLASSES)
  private Map<String, ShipClass> shipClasses = null;

  public static final String SERIALIZED_NAME_RESOURCE_NAMES = "resource-names";
  @SerializedName(SERIALIZED_NAME_RESOURCE_NAMES)
  private Map<String, String> resourceNames = null;


  public StaticData shipClasses(Map<String, ShipClass> shipClasses) {
    
    this.shipClasses = shipClasses;
    return this;
  }

  public StaticData putShipClassesItem(String key, ShipClass shipClassesItem) {
    if (this.shipClasses == null) {
      this.shipClasses = new HashMap<String, ShipClass>();
    }
    this.shipClasses.put(key, shipClassesItem);
    return this;
  }

   /**
   * Get shipClasses
   * @return shipClasses
  **/
  @javax.annotation.Nullable
  @ApiModelProperty(value = "")

  public Map<String, ShipClass> getShipClasses() {
    return shipClasses;
  }


  public void setShipClasses(Map<String, ShipClass> shipClasses) {
    this.shipClasses = shipClasses;
  }


  public StaticData resourceNames(Map<String, String> resourceNames) {
    
    this.resourceNames = resourceNames;
    return this;
  }

  public StaticData putResourceNamesItem(String key, String resourceNamesItem) {
    if (this.resourceNames == null) {
      this.resourceNames = new HashMap<String, String>();
    }
    this.resourceNames.put(key, resourceNamesItem);
    return this;
  }

   /**
   * Get resourceNames
   * @return resourceNames
  **/
  @javax.annotation.Nullable
  @ApiModelProperty(value = "")

  public Map<String, String> getResourceNames() {
    return resourceNames;
  }


  public void setResourceNames(Map<String, String> resourceNames) {
    this.resourceNames = resourceNames;
  }


  @Override
  public boolean equals(Object o) {
    if (this == o) {
      return true;
    }
    if (o == null || getClass() != o.getClass()) {
      return false;
    }
    StaticData staticData = (StaticData) o;
    return Objects.equals(this.shipClasses, staticData.shipClasses) &&
        Objects.equals(this.resourceNames, staticData.resourceNames);
  }

  @Override
  public int hashCode() {
    return Objects.hash(shipClasses, resourceNames);
  }


  @Override
  public String toString() {
    StringBuilder sb = new StringBuilder();
    sb.append("class StaticData {\n");
    sb.append("    shipClasses: ").append(toIndentedString(shipClasses)).append("\n");
    sb.append("    resourceNames: ").append(toIndentedString(resourceNames)).append("\n");
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

