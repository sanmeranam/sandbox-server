let schema = {};

// Open Parent Modal
function openParentModal(parentName = '', parentType = 'array', parentSize = '') {
    $('#parent-name').val(parentName);
    $('#parent-type').val(parentType);
    $('#parent-size').val(parentSize);
    $('#modal-parent-title').text(parentName ? 'Edit Parent Type' : 'Add Parent Type');
    $('#parent-modal').fadeIn();
}

// Close Parent Modal
$('#close-parent-modal').click(() => $('#parent-modal').fadeOut());

// Save Parent
$('#save-parent').click(() => {
    const parentName = $('#parent-name').val().trim();
    const parentType = $('#parent-type').val();
    const parentSize = $('#parent-size').val();

    if (!parentName) {
        alert('Parent name is required!');
        return;
    }

    schema[parentName] = {
        type: parentType,
        properties: {},
        required: []
    };

    if (parentType === 'array' && parentSize) {
        schema[parentName].size = parseInt(parentSize);
    }

    renderParentTypes();
    $('#parent-modal').fadeOut();
});

// Render Parent Types
function renderParentTypes() {
    $('#parent-types').empty();
    for (let parent in schema) {
        $('#parent-types').append(`
            <div class="parent-section">
                <h3>${parent} (${schema[parent].type})</h3>
                <button class="add-field" data-parent="${parent}">Add Field</button>
                <button class="edit-parent" data-parent="${parent}">Edit</button>
                <button class="delete-parent" data-parent="${parent}">Delete</button>
                <div id="fields-${parent}"></div>
            </div>
        `);
        renderFields(parent);
    }
}

// Open Field Modal
function openFieldModal(parent, fieldName = '', fieldType = 'string', fieldFaker = '') {
    $('#field-name').val(fieldName);
    $('#field-type').val(fieldType);
    $('#field-faker').val(fieldFaker);
    $('#modal-title').text(fieldName ? 'Edit Field' : 'Add Field');
    $('#field-modal').data('parent', parent).fadeIn();
}

// Close Field Modal
$('#close-field-modal').click(() => $('#field-modal').fadeOut());

// Save Field
$('#save-field').click(() => {
    const parent = $('#field-modal').data('parent');
    const fieldName = $('#field-name').val().trim();
    const fieldType = $('#field-type').val();
    const fieldFaker = $('#field-faker').val().trim();

    if (!fieldName) {
        alert('Field name is required!');
        return;
    }

    schema[parent].properties[fieldName] = { type: fieldType };
    if (fieldFaker) schema[parent].properties[fieldName].faker = fieldFaker;

    if (!schema[parent].required.includes(fieldName)) {
        schema[parent].required.push(fieldName);
    }

    renderFields(parent);
    $('#field-modal').fadeOut();
});

// Render Fields
function renderFields(parent) {
    $(`#fields-${parent}`).empty();
    for (let key in schema[parent].properties) {
        const field = schema[parent].properties[key];
        $(`#fields-${parent}`).append(`
            <div>${key} (${field.type}) ${field.faker ? `[${field.faker}]` : ''}</div>
        `);
    }
}

// Save Schema
$('#save-schema').click(() => {
    $('#output').text(JSON.stringify(schema, null, 2));
});

// Event Listeners
$(document).on('click', '#add-parent', openParentModal);
$(document).on('click', '.add-field', function () {
    openFieldModal($(this).data('parent'));
});
$(document).on('click', '.edit-parent', function () {
    const parent = $(this).data('parent');
    openParentModal(parent, schema[parent].type, schema[parent].size || '');
});

// Initial Render
renderParentTypes();