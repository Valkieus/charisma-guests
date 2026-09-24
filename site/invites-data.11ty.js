module.exports = class {
  data() {
    return {
      permalink: "invites.json",
      eleventyExcludeFromCollections: true,
    };
  }

  render(data) {
    var items = data.collections.invite.map(function (invite) {
      var d = invite.data;
      return {
        nom: d.nom,
        slug: d.slug,
        type: d.type || "Invité externe",
        notes: d.notes || null,
        chansons: d.chansons || [],
        documents: d.documents || [],
        liens_youtube: d.liens_youtube || [],
        collaborations: d.collaborations || [],
      };
    });
    return JSON.stringify(items);
  }
};
