function makeid(length) {
  var result = "";
  var characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  var charactersLength = characters.length;
  for (var i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}

export const toHHmmSS = (SECONDS) => new Date(SECONDS * 1000).toISOString().substr(11, 8);

export const formDataArray = (ar, arrayType) => {
  if (ar.length === 0) {
    let randomKey = makeid(20);
    if (arrayType === 'artists') {
      return [{ name: "", type: { value: 'main', label: 'Main Artist' }, order: 1, key: randomKey }]
    } else if (arrayType === 'contributors') {
      return [{ name: "", type: "", order: 1, key: randomKey }]
    }
  } else {
    return ar.map(i => {
      let type = arrayKind(i.kind, arrayType);
      let randomKey = makeid(20);
  
      if (arrayType === 'artists') {
        return { name: {label: i.artist.name, value: i.artist.id}, type: type, order: i.order, key: randomKey }
      } else if (arrayType === 'contributors') {
        return { name: {label: i.contributor.name, value: i.contributor.id}, type: {value: i.role.id, label: i.role.name}, order: i.order, key: randomKey }
      }
    });
  }
}

export const formDataPublishers = (ar ) => {
  if (ar.length === 0) {
    let randomKey = makeid(20);
    return [{ publisher: "", publisher_author: '', order: 0, key: randomKey }]
  } else {
    return ar.map(i => {
      let randomKey = makeid(20);
      return { publisher: {label: i.publisher.name, value: i.publisher.id}, publisher_author: i.author, order: i.order, key: randomKey }
    });
  }
}


export const formDataShareholders = (ar ) => {
  if (ar.length === 0) {
    let randomKey = makeid(20);
    return [{ shareholder: "", split: "", roles: [], order: 1, key: randomKey }]
  } else {
    return ar.map(i => {
      let randomKey = makeid(20);
      let sh_roles = i.roles.map(r => { return {label: r.name, value: r.id }});
      return { shareholder: {label: i.revenue_share_holder.name, value: i.revenue_share_holder.id}, split: i.split, roles: sh_roles, order: i.order, key: randomKey }
    });
  }
}

export const formDataCosts = (ar ) => {
  if (ar.length === 0) {
    let randomKey = makeid(20);
    return [{ cost_type: "", cost: "", order: 1, key: randomKey }]
  } else {
    return ar.map(i => {
      let randomKey = makeid(20);
      return { cost_type: {label: i.cost_type.name, value: i.cost_type.id}, cost: i.cost, order: i.order, key: randomKey }
    });
  }
}

const arrayKind = (data, arrayType) => {
  let type;

  if (arrayType === 'artists') {
    if (data === 'main') {
      type = {label: 'Main Artist', value: 'main'};
    } else if (data === 'featuring') {
      type = {label: 'Featuring Artist', value: 'featuring'};
    } else if (data === 'remixer') {
        type = {label: 'Remixer', value: "remixer"};            
    } else {
      type = {label: data, value: data};
    }
  } else if (arrayType === 'contributors') {
    if (data === "actor") {
      type = {label: "Actor", value: "actor"};
    } else if (data === "arranger") {
      type = {label: "Arranger", value: "arranger"};
    } else if (data === "choir") {
      type = {label: "Choir", value: "choir"};
    } else if (data === "composer") {
      type = {label: "Composer", value: "composer"};
    } else if (data === "conductor") {
      type = {label: "Conductor", value: "conductor"};
    } else if (data === "contributingartist") {
      type = {label: "Contributing artist", value: "contributingartist"};
    } else if (data === "engineer") {
      type = {label: "Engineer", value: "engineer"};
    } else if (data === "ensemble") {
      type = {label: "Ensemble", value: "ensemble"};
    } else if (data === "lyricist") {
      type = {label: "Lyricist", value: "lyricist"};
    } else if (data === "mixer") {
      type = {label: "Mixer", value: "mixer"};
    } else if (data === "orchestra") {
      type = {label: "Orchestra", value: "orchestra"};
    } else if (data === "performer") {
      type = {label: "Performer", value: "performer"};
    } else if (data === "producer") {
      type = {label: "Producer", value: "producer"};
    } else if (data === "soloist") {
      type = {label: "Soloist", value: "soloist"};
    } else if (data === "writer") {
      type = {label: "Writer", value: "writer"};
    }
  }
  return type;
}


