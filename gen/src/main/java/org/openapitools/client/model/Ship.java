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
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import org.openapitools.client.model.Command;
import org.openapitools.client.model.Resource;

/**
 * Ship
 */
@javax.annotation.Generated(value = "org.openapitools.codegen.languages.JavaClientCodegen", date = "2022-08-14T22:38:57.446108708+02:00[Europe/Zurich]")
public class Ship {
  public static final String SERIALIZED_NAME_SHIP_CLASS = "ship-class";
  @SerializedName(SERIALIZED_NAME_SHIP_CLASS)
  private Long shipClass;

  public static final String SERIALIZED_NAME_LIFE = "life";
  @SerializedName(SERIALIZED_NAME_LIFE)
  private Long life;

  public static final String SERIALIZED_NAME_NAME = "name";
  @SerializedName(SERIALIZED_NAME_NAME)
  private String name;

  public static final String SERIALIZED_NAME_PLAYER = "player";
  @SerializedName(SERIALIZED_NAME_PLAYER)
  private Long player;

  public static final String SERIALIZED_NAME_POSITION = "position";
  @SerializedName(SERIALIZED_NAME_POSITION)
  private List<Long> position = new ArrayList<Long>();

  public static final String SERIALIZED_NAME_PREV_POSITION = "prev-position";
  @SerializedName(SERIALIZED_NAME_PREV_POSITION)
  private List<Long> prevPosition = new ArrayList<Long>();

  public static final String SERIALIZED_NAME_RESOURCES = "resources";
  @SerializedName(SERIALIZED_NAME_RESOURCES)
  private Map<String, Resource> resources = new HashMap<String, Resource>();

  public static final String SERIALIZED_NAME_COMMAND = "command";
  @SerializedName(SERIALIZED_NAME_COMMAND)
  private Command command;


  public Ship shipClass(Long shipClass) {
    
    this.shipClass = shipClass;
    return this;
  }

   /**
   * Get shipClass
   * @return shipClass
  **/
  @ApiModelProperty(required = true, value = "")

  public Long getShipClass() {
    return shipClass;
  }


  public void setShipClass(Long shipClass) {
    this.shipClass = shipClass;
  }


  public Ship life(Long life) {
    
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


  public Ship name(String name) {
    
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


  public Ship player(Long player) {
    
    this.player = player;
    return this;
  }

   /**
   * Get player
   * @return player
  **/
  @ApiModelProperty(required = true, value = "")

  public Long getPlayer() {
    return player;
  }


  public void setPlayer(Long player) {
    this.player = player;
  }


  public Ship position(List<Long> position) {
    
    this.position = position;
    return this;
  }

  public Ship addPositionItem(Long positionItem) {
    this.position.add(positionItem);
    return this;
  }

   /**
   * Get position
   * @return position
  **/
  @javax.annotation.Nullable
  @ApiModelProperty(example = "[10,20]", required = true, value = "")

  public List<Long> getPosition() {
    return position;
  }


  public void setPosition(List<Long> position) {
    this.position = position;
  }


  public Ship prevPosition(List<Long> prevPosition) {
    
    this.prevPosition = prevPosition;
    return this;
  }

  public Ship addPrevPositionItem(Long prevPositionItem) {
    this.prevPosition.add(prevPositionItem);
    return this;
  }

   /**
   * Get prevPosition
   * @return prevPosition
  **/
  @javax.annotation.Nullable
  @ApiModelProperty(example = "[10,20]", required = true, value = "")

  public List<Long> getPrevPosition() {
    return prevPosition;
  }


  public void setPrevPosition(List<Long> prevPosition) {
    this.prevPosition = prevPosition;
  }


  public Ship resources(Map<String, Resource> resources) {
    
    this.resources = resources;
    return this;
  }

  public Ship putResourcesItem(String key, Resource resourcesItem) {
    this.resources.put(key, resourcesItem);
    return this;
  }

   /**
   * Get resources
   * @return resources
  **/
  @ApiModelProperty(required = true, value = "")

  public Map<String, Resource> getResources() {
    return resources;
  }


  public void setResources(Map<String, Resource> resources) {
    this.resources = resources;
  }


  public Ship command(Command command) {
    
    this.command = command;
    return this;
  }

   /**
   * Get command
   * @return command
  **/
  @javax.annotation.Nullable
  @ApiModelProperty(value = "")

  public Command getCommand() {
    return command;
  }


  public void setCommand(Command command) {
    this.command = command;
  }


  @Override
  public boolean equals(Object o) {
    if (this == o) {
      return true;
    }
    if (o == null || getClass() != o.getClass()) {
      return false;
    }
    Ship ship = (Ship) o;
    return Objects.equals(this.shipClass, ship.shipClass) &&
        Objects.equals(this.life, ship.life) &&
        Objects.equals(this.name, ship.name) &&
        Objects.equals(this.player, ship.player) &&
        Objects.equals(this.position, ship.position) &&
        Objects.equals(this.prevPosition, ship.prevPosition) &&
        Objects.equals(this.resources, ship.resources) &&
        Objects.equals(this.command, ship.command);
  }

  @Override
  public int hashCode() {
    return Objects.hash(shipClass, life, name, player, position, prevPosition, resources, command);
  }


  @Override
  public String toString() {
    StringBuilder sb = new StringBuilder();
    sb.append("class Ship {\n");
    sb.append("    shipClass: ").append(toIndentedString(shipClass)).append("\n");
    sb.append("    life: ").append(toIndentedString(life)).append("\n");
    sb.append("    name: ").append(toIndentedString(name)).append("\n");
    sb.append("    player: ").append(toIndentedString(player)).append("\n");
    sb.append("    position: ").append(toIndentedString(position)).append("\n");
    sb.append("    prevPosition: ").append(toIndentedString(prevPosition)).append("\n");
    sb.append("    resources: ").append(toIndentedString(resources)).append("\n");
    sb.append("    command: ").append(toIndentedString(command)).append("\n");
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
