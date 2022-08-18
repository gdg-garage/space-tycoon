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
 * EndTurn
 */
@javax.annotation.Generated(value = "org.openapitools.codegen.languages.JavaClientCodegen", date = "2022-08-14T22:38:57.446108708+02:00[Europe/Zurich]")
public class EndTurn {
  public static final String SERIALIZED_NAME_TICK = "tick";
  @SerializedName(SERIALIZED_NAME_TICK)
  private Long tick;


  public EndTurn tick(Long tick) {
    
    this.tick = tick;
    return this;
  }

   /**
   * Get tick
   * @return tick
  **/
  @ApiModelProperty(required = true, value = "")

  public Long getTick() {
    return tick;
  }


  public void setTick(Long tick) {
    this.tick = tick;
  }


  @Override
  public boolean equals(Object o) {
    if (this == o) {
      return true;
    }
    if (o == null || getClass() != o.getClass()) {
      return false;
    }
    EndTurn endTurn = (EndTurn) o;
    return Objects.equals(this.tick, endTurn.tick);
  }

  @Override
  public int hashCode() {
    return Objects.hash(tick);
  }


  @Override
  public String toString() {
    StringBuilder sb = new StringBuilder();
    sb.append("class EndTurn {\n");
    sb.append("    tick: ").append(toIndentedString(tick)).append("\n");
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

