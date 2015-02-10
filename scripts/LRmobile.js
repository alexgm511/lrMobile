// JavaScript Document

	var inventory = [];
	inventory.push({"sku": "LRD14-F04MF", "Type": 1, "Description": "14in. Man's Deluxe", "SmImage": "images/Deluxe17-sm.png", "Price": 399.85});
	inventory.push({"sku": "LRD17-F04MF", "Type": 1, "Description": "17in. Man's Deluxe", "SmImage": "images/Deluxe17-sm.png", "Price": 399.85});
	inventory.push({"sku": "LRD19-F04MF", "Type": 1, "Description": "19in. Man's Deluxe", "SmImage": "images/Deluxe17-sm.png", "Price": 399.85});
	inventory.push({"sku": "LRD22-F04MF", "Type": 1, "Description": "22in. Man's Deluxe", "SmImage": "images/Deluxe17-sm.png", "Price": 399.85});
	inventory.push({"sku": "LRD12-F04WF", "Type": 1, "Description": "12in. Woman's Deluxe", "SmImage": "images/Deluxe15st-sm.png", "Price": 399.85});
	inventory.push({"sku": "LRD15-F04WF", "Type": 1, "Description": "15in. Woman's Deluxe", "SmImage": "images/Deluxe15st-sm.png", "Price": 399.85});
	inventory.push({"sku": "LRD17-F04WF", "Type": 1, "Description": "17in. Woman's Deluxe", "SmImage": "images/Deluxe17w-sm.png", "Price": 399.85});
	inventory.push({"sku": "AC400CH", "Type": 2, "Description": "Rear Rack", "SmImage": "images/rearRack-sm.png", "Price": 59.95});
	inventory.push({"sku": "LRACKIT2", "Type": 2, "Description": "LandRider Accessory Kit", "SmImage": "images/kit-1-sm.png", "Price": 39.95});
	inventory.push({"sku": "AC600", "Type": 2, "Description": "Alloy Floor Pump", "SmImage": "images/floorPump-sm.png", "Price": 69.95});
	inventory.push({"sku": "AC510BK", "Type": 2, "Description": "Cyclo-Computer", "SmImage": "images/cycloComputer-sm.png", "Price": 44.95});
	localStorage.setItem('inventory', JSON.stringify(inventory));
	
	var cTotal = [];
	cTotal.push({"cartTotal": 0});
	localStorage.setItem('cTotal', JSON.stringify(cTotal));

	$(document).ready(function(){
		$( document ).on("click","button#to-cart-a", function() {
			var cartData = [];
			var type, sku, desc, smImg, qty, price;
			err = "";
			if ( $("#select-bike-a").val() === "0") {
				$( "#chooseBikeAlert" ).popup( "open" );
				$("#select-bike-a").focus();
				return(false);
			} else {
				// populate the variables with all the item details 
				sku = $("#select-bike-a").val();
				qty = $("#select-qty-a").val();
				console.log(sku + " " + qty); 
				item2cart(sku, qty);
				return( true );
			}
		});
		
		// Click delete split-button to remove list item
		$( ".delete" ).on( "click", function() {
			var listitem = $( this ).parent( "li.ui-li" );
			listitem.remove();
			$( this ).parent('.ui-listview').listview("refresh");
			//$( "#list" ).listview( "refresh" );
			
			//confirmAndDelete( listitem );
		});
		$( document ).on( "click", "#emptyCart", function() {
			localStorage['cartItems'] = [];
		});
		
		// function that deletes list item - after confirming message
		$(document).on("pageinit", "#cart", function () {
			var SelectedLi = '';
		
			$('[href=#delCartItem]').on('click', function (e) {
				SelectedLi = $(this).closest("li");
				// locate SKU to delete from localStorage
				itemSKU = $(this).prev().children("span.itemSKU").text();
			});
			// need to delete from localStorage
			$('#deleter').on('click', function () {
				$(SelectedLi).remove();
				delFromCart(itemSKU,1);
				$('#cartList').listview("refresh");
				$('#delCartItem').popup('close');
			});
		
			$('#canceler').on('click', function () {
				$('#delCartItem').popup('close');
			});
		});
		
		$( document ).on( "click", "#storage", function() {
			for (var i = 0; i < localStorage.length; i++){
				console.log(localStorage.key(i)+"=["+localStorage.getItem(localStorage.key(i))+"]");
			}
		});
		
	});
	// Lookup sku info from inventory array and add to cartData array
	function item2cart( sku, qty ) {
		var type, desc, smImg, price, cItems;
		var found = false;
		$.each(inventory, function(index, cItem){
			if (cItem.sku === sku) {
				type = inventory[index].Type;
				desc = inventory[index].Description;
				smImg = inventory[index].SmImage;
				price = inventory[index].Price;
				return false;
			}
		});	
		// Look for item on cart, if found increment quantity, else add item to cart
		cItems = localStorage.cartItems? JSON.parse(localStorage["cartItems"]) : [];
		console.log(cTotal[0].cartTotal);
		$.each(cItems, function(index, cItem){
			if (cItem.SKU === sku) {
				cItem.Qty = parseInt(cItem.Qty) + parseInt(qty);
				found = true;
				return false;
			}
		});	
		if ( found == false ) {
			cItems.push({"Type": type, "SKU": sku, "Description": desc, "SmImage": smImg, "Qty": qty, "Price": price});
		}
		localStorage["cartItems"] = JSON.stringify(cItems);
		$.mobile.navigate( "cart.html" );
	}
	function delFromCart( sku, qty ) {
		// retrieve all items from cart
		var cItems = localStorage.cartItems? JSON.parse(localStorage["cartItems"]) : [];
		// FUTURE feature: find item subtract qty to delete 
		// if result is 0, delete item 
		$.each(cItems, function(index, cItem){
			if (cItem.SKU === sku) {
				// *** update to enter quantity to delete
				/*cItem.Qty = parseInt(cItem.Qty) - parseInt(qty);
				if (parseInt(cItem.Qty) < 1) {
					cItems.splice(index,1);
				} */
				// for now just delete indicated SKU
				cItems.splice(index,1);
				return false;
			}
		});	
		localStorage["cartItems"] = JSON.stringify(cItems);
		updateTotal();
	}
	
	function updateTotal() {
		var cItems = localStorage.cartItems? JSON.parse(localStorage["cartItems"]) : [];
		var total = 0;
		$.each(cItems, function(index, cItem){
			total = total + (parseFloat(cItem.Price) * parseInt(cItem.Qty));
		});
		var cTotal = localStorage.cTotal? JSON.parse(localStorage["cTotal"]) : [];
		cTotal[0].cartTotal = total;
		localStorage["cTotal"] = JSON.stringify(cTotal);
		// Update total displayed on cart
		$("h3#totBar").text("Total: $"+total.toFixed(2));
	}