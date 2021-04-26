
function initCustomTag(tagName, initFunction) {
    document.createElement(tagName);
    //find all the tags occurrences (instances) in the document
    var tagInstances = document.getElementsByTagName(tagName);
    //for each occurrence run the associated function
    for (var i = 0; i < tagInstances.length; i++) {
        initFunction(tagInstances[i]);
    }
}

function createBodyOfMyCombobox(element) {
    //code for rendering the element goes here
    if (element.attributes.data) {
        //get the data address from the element's data attribute
        const data = element.attributes.data.value;
        var input = document.createElement("input");
        input.classList.add("datalist-input");
        input.placeholder = element.attributes.placeholder.value;
        element.appendChild(input);
        element.innerHTML += `<div class="warning">Dữ liệu không tồn tại trong hệ thống</div>`;
        element.innerHTML += `<img src="icons/chevron-down-outline.svg">`;
        var list = document.createElement("ul");
        list.classList.add("datalist-ul");

        var itemsData = JSON.parse(data).data;
        list.innerHTML = itemsData.map(e => `<li id="${element.id+e.value}" value="${e.value}"><img src="icons/checkmark-outline.svg">${e.text}</li>`).join("");
        element.appendChild(list);
        addListener(element);
    }
}

function addListener(element){
    const input  = element.getElementsByClassName("datalist-input")[0];
    const list = element.getElementsByClassName("datalist-ul")[0];
    const options = JSON.parse(element.attributes.data.value).data;
    var filterOptions = options;
    let selectedItem = -1;
    element.addEventListener("click", e => {
        if (e.target.classList.contains("datalist-input")) {
            element.classList.toggle("active");
        } else if (e.target.nodeName.toLocaleLowerCase() === "img") {
            element.classList.toggle("active");
            input.focus();
        }
    });

    input.addEventListener('input', function(e) {
        if (!element.classList.contains("active")) {
            element.classList.add("active");
        }

        filterOptions = options.filter(
			d => input.value === "" || d.text.toLocaleLowerCase().includes(input.value.toLocaleLowerCase())
		);

        console.log(filterOptions);

        if (filterOptions.length === 0) {
			element.classList.remove("active");
            input.classList.add("error");
		} else {
			element.classList.add("active");
            input.classList.remove("error");
		}

        selectedItem = -1;

		list.innerHTML = filterOptions
			.map(o => `<li id="${element.id+o.value}" value="${o.value}"><img src="icons/checkmark-outline.svg">${o.text}</li>`)
			.join("");
    });

    list.addEventListener("click", function(e) {
        if (e.target.nodeName.toLocaleLowerCase() === "li") {
            input.value = e.target.innerText;
            element.classList.remove("active");
            input.classList.remove("error");
            let obj = {
                value : e.target.value,
                text : ""+e.target.innerText.toString()
            }

            selectedItem = filterOptions.findIndex(x => x.value === obj.value && x.text === obj.text);

            list.innerHTML = filterOptions
			.map(o => `<li id="${element.id+o.value}" value="${o.value}"><img src="icons/checkmark-outline.svg">${o.text}</li>`)
			.join("");

            document.getElementById(`${element.id + filterOptions[selectedItem].value}`).classList.add("active");
        }
    });

    element.addEventListener('keyup', function(event){
        if(!element.classList.contains("active")){
            element.classList.add("active");
        }
        if(event.keyCode === 38 ){
            if (selectedItem > 0) {
                selectedItem -= 1;
                console.log(selectedItem);
                list.innerHTML = filterOptions
                    .map(o => `<li id="${element.id + o.value}" value="${o.value}"><img src="icons/checkmark-outline.svg">${o.text}</li>`)
                    .join("");

                document.getElementById(`${element.id + filterOptions[selectedItem].value}`).classList.add("active");
                input.value = document.getElementById(`${element.id + filterOptions[selectedItem].value}`).innerText;
            }
        }
        else if(event.keyCode === 40){
            if(selectedItem < (filterOptions.length - 1)){
                selectedItem += 1;
                console.log(selectedItem);
                list.innerHTML = filterOptions
                    .map(o => `<li id="${element.id + o.value}" value="${o.value}"><img src="icons/checkmark-outline.svg">${o.text}</li>`)
                    .join("");

                document.getElementById(`${element.id + filterOptions[selectedItem].value}`).classList.add("active");
                input.value = document.getElementById(`${element.id + filterOptions[selectedItem].value}`).innerText;
            }
        }
        else if(event.keyCode === 13){
            element.classList.remove("active");

            list.innerHTML = options
                    .map(o => `<li id="${element.id + o.value}" value="${o.value}"><img src="icons/checkmark-outline.svg">${o.text}</li>`)
                    .join("");

            document.getElementById(`${element.id + options[selectedItem].value}`).classList.add("active");
            filterOptions = options;
            selectedItem = filterOptions.findIndex(x => x.value === obj.value && x.text === obj.text);
        }
    });

    input.addEventListener("focusout", function(){
        var val = element.getElementsByClassName("datalist-input")[0];
        var ind = options.findIndex(x => x.text.toLocaleLowerCase() === val.value.toLocaleLowerCase());
        if(ind === -1){
            val.classList.add("error");
        }
        else{
            val.classList.remove("error");
            selectedItem = ind;
            list.innerHTML = options
                    .map(o => `<li id="${element.id + o.value}" value="${o.value}"><img src="icons/checkmark-outline.svg">${o.text}</li>`)
                    .join("");

            document.getElementById(`${element.id + options[selectedItem].value}`).classList.add("active");
            input.value = document.getElementById(`${element.id + options[selectedItem].value}`).innerText;
        }

        // element.classList.remove("active");
    })
}

initCustomTag("my-combobox", createBodyOfMyCombobox);

jQuery.fn.extend({
    getText: function(){
        return this.children(".datalist-input").val();
    },
    getData: function() {
        return JSON.parse(this.attr("data")).data;
    },

    getValue: function(){
        if(this.children(".datalist-ul").children(".active").val()){
            return this.children(".datalist-ul").children(".active").val();
        }
        return null;
    }
})

