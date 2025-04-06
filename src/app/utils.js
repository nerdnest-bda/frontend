const assign_quadrant = (lat, lng) => {
    let us_center_lat = 39.8
    let us_center_lon = -98.6
    if (lat > us_center_lat && lng < us_center_lon){
        return "q1"
    }
    else if (lat > us_center_lat && lng > us_center_lon){
        return "q2"
    }
    else if (lat < us_center_lat && lng < us_center_lon){
        return "q3" 
    }
    else{       
        return "q4"
    }
}

export default assign_quadrant