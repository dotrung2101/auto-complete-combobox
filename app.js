
function customTag(tagName, fn) {
    document.createElement(tagName);
    //find all the tags occurrences (instances) in the document
    var tagInstances = document.getElementsByTagName(tagName);
    //for each occurrence run the associated function
    for (var i = 0; i < tagInstances.length; i++) {
        fn(tagInstances[i]);
    }
}

function createBodyOfCustomTag(element) {
    //code for rendering the element goes here
    if (element.attributes.data) {
        //get the data address from the element's data attribute
        const data = element.attributes.data.value;
        var input = document.createElement("input");
        input.classList.add("datalist-input");
        input.placeholder = "Giới tính";
        element.appendChild(input);
        element.innerHTML += `<div class="warning">Dữ liệu không tồn tại trong hệ thống</div>`;
        element.innerHTML += `<i id="datalist-icon" class="fa fa-angle-down" aria-hidden="true"></i>`;
        var list = document.createElement("ul");
        list.classList.add("datalist-ul");

        var itemsData = data.split(",");
        list.innerHTML = itemsData.map(e => `<li id="${element.id+e}">${e}</li>`).join("");
        element.appendChild(list);
        addListener(element);
    }
}

function addListener(element){
    var input  = element.getElementsByClassName("datalist-input")[0];
    const list = element.getElementsByClassName("datalist-ul")[0];
    const options = element.attributes.data.value.split(",");
    element.addEventListener("click", e => {
        if (e.target.classList.contains("datalist-input")) {
            element.classList.toggle("active");
        } else if (e.target.nodeName.toLocaleLowerCase() === "i") {
            element.classList.toggle("active");
            input.focus();
        }
    });

    input.addEventListener('input', function(e) {
        if (!element.classList.contains("active")) {
            element.classList.add("active");
        }

        const filterOptions = options.filter(
			d => input.value === "" || d.toLocaleLowerCase().includes(input.value.toLocaleLowerCase())
		);

        console.log(filterOptions);

        if (filterOptions.length === 0) {
			list.classList.remove("active");
            input.classList.add("error");
		} else {
			list.classList.add("active");
            input.classList.remove("error");
		}

		list.innerHTML = filterOptions
			.map(o => `<li id="${element.id+filterOptions.indexOf(o)}">${o}</li>`)
			.join("");
    });

    list.addEventListener("click", function(e) {
        if (e.target.nodeName.toLocaleLowerCase() === "li") {
            input.value = e.target.innerText;
            element.classList.remove("active");
            const selectedItem = e.target.id;

            list.innerHTML = options
			.map(o => `<li id="${element.id+o}">${o}</li>`)
			.join("");

            document.getElementById(`${selectedItem}`).classList.add("active");
        }
    });

    element.addEventListener('onkeyup', function(){
        element
    });
}

customTag("my-combobox", createBodyOfCustomTag);